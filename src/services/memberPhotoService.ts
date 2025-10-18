import { supabase } from "@/integrations/supabase/client";

/**
 * Upload member photo to storage
 */
export async function uploadMemberPhoto(file: File): Promise<string> {
  try {
    console.log("Starting member photo upload process");
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
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
