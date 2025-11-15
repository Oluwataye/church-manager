import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RateLimitConfig {
  max_requests: number;
  window_minutes: number;
}

const RATE_LIMIT_CONFIGS: { [key: string]: RateLimitConfig } = {
  'auth': { max_requests: 5, window_minutes: 15 },
  'validation': { max_requests: 20, window_minutes: 5 },
  'default': { max_requests: 30, window_minutes: 5 },
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { endpoint, category = 'default' } = await req.json();
    
    // Extract identifier (IP or user_id)
    const ip_address = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    
    const authHeader = req.headers.get('Authorization');
    let identifier = ip_address;
    
    if (authHeader) {
      const { data: { user } } = await supabaseClient.auth.getUser(
        authHeader.replace('Bearer ', '')
      );
      if (user) {
        identifier = user.id;
      }
    }

    const config = RATE_LIMIT_CONFIGS[category] || RATE_LIMIT_CONFIGS.default;
    const window_start = new Date();
    window_start.setMinutes(window_start.getMinutes() - config.window_minutes);

    console.log('Checking rate limit:', {
      identifier,
      endpoint,
      category,
      config,
      window_start: window_start.toISOString(),
    });

    // Get existing rate limit record within the time window
    const { data: existingLimit, error: fetchError } = await supabaseClient
      .from('rate_limits')
      .select('*')
      .eq('identifier', identifier)
      .eq('endpoint', endpoint)
      .gte('window_start', window_start.toISOString())
      .order('window_start', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching rate limit:', fetchError);
      throw fetchError;
    }

    let current_count = 0;
    let rate_limit_id = null;

    if (existingLimit) {
      current_count = existingLimit.request_count + 1;
      
      // Update existing record
      const { data: updated, error: updateError } = await supabaseClient
        .from('rate_limits')
        .update({ request_count: current_count })
        .eq('id', existingLimit.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating rate limit:', updateError);
        throw updateError;
      }
      
      rate_limit_id = updated.id;
    } else {
      // Create new record
      const { data: created, error: createError } = await supabaseClient
        .from('rate_limits')
        .insert({
          identifier,
          endpoint,
          request_count: 1,
          window_start: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating rate limit:', createError);
        throw createError;
      }

      current_count = 1;
      rate_limit_id = created.id;
    }

    const is_rate_limited = current_count > config.max_requests;

    console.log('Rate limit check result:', {
      current_count,
      max_requests: config.max_requests,
      is_rate_limited,
    });

    // Create security alert if rate limited
    if (is_rate_limited) {
      console.warn('Rate limit exceeded:', {
        identifier,
        endpoint,
        current_count,
        max_requests: config.max_requests,
      });

      await supabaseClient
        .from('security_alerts')
        .insert({
          alert_type: 'rate_limit_exceeded',
          severity: current_count > config.max_requests * 2 ? 'high' : 'medium',
          identifier,
          endpoint,
          details: {
            current_count,
            max_requests: config.max_requests,
            window_minutes: config.window_minutes,
            ip_address,
          },
        });
    }

    return new Response(
      JSON.stringify({
        allowed: !is_rate_limited,
        current_count,
        max_requests: config.max_requests,
        window_minutes: config.window_minutes,
        retry_after: is_rate_limited ? config.window_minutes * 60 : null,
      }),
      { 
        status: is_rate_limited ? 429 : 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Rate limit error:', error);
    return new Response(
      JSON.stringify({ 
        allowed: true, // Fail open to not block legitimate requests
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});