import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_PROFILE_PHOTO_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_LOGO_SIZE = 5 * 1024 * 1024; // 5MB

interface ValidationRequest {
  fileType: string;
  fileSize: number;
  fileName: string;
  uploadType: 'profile' | 'logo';
}

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

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: ValidationRequest = await req.json();
    console.log('Validating file upload:', {
      type: body.uploadType,
      fileType: body.fileType,
      size: body.fileSize,
    });

    const errors: string[] = [];

    // Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(body.fileType)) {
      errors.push('Invalid file type. Only JPEG, PNG, and WEBP images are allowed.');
    }

    // Validate file size based on upload type
    const maxSize = body.uploadType === 'profile' ? MAX_PROFILE_PHOTO_SIZE : MAX_LOGO_SIZE;
    if (body.fileSize > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      errors.push(`File size exceeds ${maxSizeMB}MB limit.`);
    }

    // Validate file extension
    const extension = body.fileName.split('.').pop()?.toLowerCase();
    const validExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    
    if (!extension || !validExtensions.includes(extension)) {
      errors.push('Invalid file extension.');
    }

    // Check for path traversal attempts
    if (body.fileName.includes('/') || body.fileName.includes('\\')) {
      errors.push('Invalid file name.');
    }

    // Log validation result
    if (errors.length > 0) {
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
        sanitizedFileName: body.fileName.replace(/[^a-zA-Z0-9._-]/g, '_')
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in validate-file-upload function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
