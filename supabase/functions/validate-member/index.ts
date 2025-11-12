import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';
import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Member validation schema
const memberSchema = z.object({
  email: z.string()
    .email("Invalid email format")
    .max(255, "Email must be less than 255 characters")
    .optional()
    .or(z.literal("")),
  phone: z.string()
    .regex(/^[0-9+\-\(\)\s]{7,20}$/, "Invalid phone format (7-20 digits, can include +, -, (), spaces)")
    .max(20, "Phone number must be less than 20 characters")
    .optional()
    .or(z.literal("")),
  full_name: z.string()
    .trim()
    .min(1, "Full name is required")
    .max(100, "Name must be less than 100 characters"),
  gender: z.enum(['male', 'female']).optional(),
  date_of_birth: z.string().optional(),
  marital_status: z.enum(['single', 'married', 'divorced', 'widowed']).optional(),
  address: z.string().max(500, "Address must be less than 500 characters").optional(),
  city: z.string().max(100, "City must be less than 100 characters").optional(),
  state: z.string().max(100, "State must be less than 100 characters").optional(),
  occupation: z.string().max(100, "Occupation must be less than 100 characters").optional(),
  member_type: z.enum(['full', 'associate', 'visitor']).optional(),
  join_date: z.string().optional(),
  church_group_id: z.string().uuid("Invalid group ID").optional().nullable(),
  notes: z.string().max(1000, "Notes must be less than 1000 characters").optional(),
  is_baptized: z.boolean().optional(),
  baptism_date: z.string().optional(),
  wofbi_type: z.enum(['none', 'graduate', 'student']).optional(),
  wofbi_year: z.string().max(50, "WOFBI year must be less than 50 characters").optional(),
});

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
    console.log('Validating member data:', { ...body, email: body.email ? '***' : undefined });

    // Validate the member data
    const validationResult = memberSchema.safeParse(body);

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
    console.error('Error in validate-member function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
