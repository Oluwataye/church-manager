import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AuditLogRequest {
  action: string;
  table_name?: string;
  record_id?: string;
  old_data?: any;
  new_data?: any;
  ip_address?: string;
  user_agent?: string;
}

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

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    let user_id = null;
    
    if (authHeader) {
      const { data: { user } } = await supabaseClient.auth.getUser(
        authHeader.replace('Bearer ', '')
      );
      user_id = user?.id;
    }

    const body: AuditLogRequest = await req.json();
    
    // Extract client info
    const ip_address = body.ip_address || req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const user_agent = body.user_agent || req.headers.get('user-agent') || 'unknown';

    console.log('Creating audit log:', {
      user_id,
      action: body.action,
      table_name: body.table_name,
      record_id: body.record_id,
      ip_address,
    });

    // Insert audit log
    const { data, error } = await supabaseClient
      .from('audit_logs')
      .insert({
        user_id,
        action: body.action,
        table_name: body.table_name,
        record_id: body.record_id,
        old_data: body.old_data,
        new_data: body.new_data,
        ip_address,
        user_agent,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating audit log:', error);
      throw error;
    }

    console.log('Audit log created successfully:', data.id);

    return new Response(
      JSON.stringify({ success: true, audit_log_id: data.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Audit log error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});