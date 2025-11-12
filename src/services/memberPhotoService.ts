import { supabase } from "@/integrations/supabase/client";
import { validateProfilePhoto, sanitizeFileName, scanFileForMalware } from "@/utils/fileValidation";

/**
 * Upload member photo to storage with server-side validation
 */
export async function uploadMemberPhoto(file: File): Promise<string> {
  try {
    console.log("Starting member photo upload process");
    
    // Client-side validation
    const clientValidation = validateProfilePhoto(file);
    if (!clientValidation.valid) {
      throw new Error(clientValidation.error);
    }

    // Malware scanning
    const malwareCheck = await scanFileForMalware(file);
    if (!malwareCheck.valid) {
      throw new Error(malwareCheck.error);
    }

    // Server-side validation
    const { data: validationData, error: validationError } = await supabase.functions.invoke(
      'validate-file-upload',
      {
        body: {
          fileType: file.type,
          fileSize: file.size,
          fileName: file.name,
          uploadType: 'profile',
        },
      }
    );

    if (validationError || !validationData?.valid) {
      const errors = validationData?.errors || ['File validation failed'];
      throw new Error(errors.join(', '));
    }

    const fileExt = file.name.split('.').pop();
    const sanitized = sanitizeFileName(file.name.split('.')[0]);
    const fileName = `${sanitized}_${crypto.randomUUID()}.${fileExt}`;
    const filePath = `member-photos/${fileName}`;

    console.log("Uploading to storage path:", filePath);
    
    // Upload the file to storage
    const { error: uploadError } = await supabase.storage
      .from('church-assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }

    console.log("File uploaded successfully");

    // Get the public URL of the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('church-assets')
      .getPublicUrl(filePath);

    console.log("Public URL generated:", publicUrl);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading member photo:', error);
    throw error;
  }
}
