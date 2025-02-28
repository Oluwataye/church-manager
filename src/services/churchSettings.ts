
import { supabase } from "@/integrations/supabase/client";

export interface ChurchSettings {
  logo_url?: string;
}

export async function fetchChurchSettings(): Promise<ChurchSettings> {
  try {
    console.log("Fetching church settings");
    const { data, error } = await supabase
      .from('church_settings')
      .select('logo_url')
      .single();
    
    if (error) {
      console.error("Error fetching church settings:", error);
      // If no settings exist, create default settings
      if (error.code === 'PGRST116') {
        await createDefaultSettings();
        return { logo_url: undefined };
      }
      throw error;
    }
    
    console.log("Settings fetched:", data);
    return data;
  } catch (error) {
    console.error("Error in fetchChurchSettings:", error);
    return { logo_url: undefined };
  }
}

async function createDefaultSettings() {
  try {
    const { error } = await supabase
      .from('church_settings')
      .insert({
        church_name: 'LIVING FAITH CHURCH',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (error) throw error;
  } catch (error) {
    console.error("Error creating default settings:", error);
  }
}

// Create the storage bucket if it doesn't exist
async function ensureBucketExists() {
  try {
    // First check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error("Error listing buckets:", listError);
      throw listError;
    }
    
    // Check if our bucket exists
    const bucketExists = buckets.some(bucket => bucket.name === 'church-assets');
    
    if (!bucketExists) {
      console.log("Bucket 'church-assets' doesn't exist, creating it");
      const { error: createError } = await supabase.storage.createBucket('church-assets', {
        public: true,  // This will create the bucket as public already
        fileSizeLimit: 5242880 // 5MB
      });
      
      if (createError) {
        console.error("Error creating bucket:", createError);
        throw createError;
      }
      
      console.log("Bucket 'church-assets' created successfully");
      
      // Note: Removing the setPublic() call as it's not available in the API
      // The bucket is already set as public during creation with the 'public: true' option
    }
  } catch (error) {
    console.error("Error ensuring bucket exists:", error);
    throw error;
  }
}

export async function uploadLogo(file: File) {
  try {
    console.log("Starting logo upload process");
    
    // Ensure the bucket exists before uploading
    await ensureBucketExists();
    
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
