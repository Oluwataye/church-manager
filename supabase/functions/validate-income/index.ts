import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';
import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Income validation schema
const incomeSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  service_type: z.enum(['sunday', 'midweek', 'special'], {
    errorMap: () => ({ message: "Invalid service type" }),
  }),
  category: z.enum(['tithe', 'offering', 'thanksgiving', 'prophet', 'project', 'shiloh'], {
    errorMap: () => ({ message: "Invalid category" }),
  }),
  amount: z.number()
    .positive("Amount must be greater than 0")
    .max(10000000, "Amount must be less than 10,000,000")
    .refine((val) => Number.isFinite(val), "Amount must be a valid number"),
  description: z.string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
});

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check rate limit
    const rateLimitResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/rate-limit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.get('Authorization') || '',
        'x-forwarded-for': req.headers.get('x-forwarded-for') || '',
      },
      body: JSON.stringify({
        endpoint: 'validate-income',
        category: 'validation',
      }),
    });

    const rateLimit = await rateLimitResponse.json();
    
    if (!rateLimit.allowed) {
      console.warn('Rate limit exceeded for validate-income');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Too many requests. Please try again in ${Math.ceil((rateLimit.retry_after || 300) / 60)} minutes.`
        }),
        { 
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verify user is authenticated and is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has admin role
    const { data: roleData, error: roleError } = await supabase
      .rpc('has_role', { _user_id: user.id, _role: 'admin' });

    if (roleError || !roleData) {
      console.error('Role check failed:', roleError);
      return new Response(
        JSON.stringify({ error: 'Forbidden: Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    console.log('Validating income data');

    // Validate the income data
    const validationResult = incomeSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      
      console.log('Validation failed:', errors);
      
      return new Response(
        JSON.stringify({ 
          valid: false, 
          errors 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Validation successful');

    return new Response(
      JSON.stringify({ 
        valid: true, 
        data: validationResult.data 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in validate-income function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
