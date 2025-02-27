
import { supabase } from "@/integrations/supabase/client";

export interface ChurchSettings {
  logo_url?: string;
}

export async function fetchChurchSettings(): Promise<ChurchSettings> {
  const { data, error } = await supabase
    .from('church_settings')
    .select('logo_url')
    .single();
  
  if (error) throw error;
  return data;
}

export async function uploadLogo(file: File) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    // First upload the file to storage
    const { error: uploadError } = await supabase.storage
      .from('church-assets')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get the public URL of the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('church-assets')
      .getPublicUrl(filePath);

    // Update the church settings with the new logo URL
    const { data, error: updateError } = await supabase
      .from('church_settings')
      .update({ 
        logo_url: publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('church_name', 'LIVING FAITH CHURCH')
      .select()
      .single();

    if (updateError) throw updateError;

    return { publicUrl, data };
  } catch (error) {
    console.error('Error uploading logo:', error);
    throw error;
  }
}
