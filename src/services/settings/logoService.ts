import { supabase } from "@/integrations/supabase/client";

/**
 * Upload logo to storage and update settings
 */
export async function uploadLogo(file: File) {
  try {
    console.log("Starting logo upload process");
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    console.log("Uploading to storage path:", filePath);
    
    // Upload the file to storage
    const { error: uploadError } = await supabase.storage
      .from('church-assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
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

    // Check if there are existing settings
    const { data: existingSettings, error: fetchError } = await supabase
      .from('church_settings')
      .select('*')
      .eq('church_name', 'LIVING FAITH CHURCH')
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error("Error fetching settings:", fetchError);
      throw fetchError;
    }
    
    let data;
    if (existingSettings) {
      // Update existing settings
      console.log("Updating existing settings");
      const { data: updateData, error: updateError } = await supabase
        .from('church_settings')
        .update({ 
          logo_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('church_name', 'LIVING FAITH CHURCH')
        .select()
        .single();

      if (updateError) {
        console.error("Update error:", updateError);
        throw updateError;
      }
      
      data = updateData;
    } else {
      // Create new settings
      console.log("Creating new settings");
      const { data: insertData, error: insertError } = await supabase
        .from('church_settings')
        .insert({ 
          church_name: 'LIVING FAITH CHURCH',
          logo_url: publicUrl,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) {
        console.error("Insert error:", insertError);
        throw insertError;
      }
      
      data = insertData;
    }

    console.log("Settings updated successfully:", data);
    return { publicUrl, data };
  } catch (error) {
    console.error('Error uploading logo:', error);
    throw error;
  }
}
