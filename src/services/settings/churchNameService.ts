
import { supabase } from "@/integrations/supabase/client";
import { getLocalSettings } from "./settingsCore";

/**
 * Update church name in the database and local storage
 */
export async function updateChurchName(churchName: string) {
  try {
    console.log("Updating church name to:", churchName);
    
    // Update localStorage first for immediate access
    localStorage.setItem('churchName', churchName);
    
    // Dispatch custom event for immediate updates across the app
    const nameUpdatedEvent = new CustomEvent('churchNameUpdated', { 
      detail: { churchName } 
    });
    window.dispatchEvent(nameUpdatedEvent);
    
    // If offline, just return with success from local update
    if (!navigator.onLine) {
      console.log("Device is offline, church name updated locally only");
      return { data: { church_name: churchName } };
    }
    
    // Continue with server update if online
    // Check if there are existing settings
    const { data: existingSettings, error: fetchError } = await supabase
      .from('church_settings')
      .select('*')
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
          church_name: churchName,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSettings.id)
        .select()
        .single();

      if (updateError) {
        console.error("Update error:", updateError);
        throw updateError;
      }
      
      data = updateData;
    } else {
      // Create new settings
      console.log("Creating new settings with church name");
      const { data: insertData, error: insertError } = await supabase
        .from('church_settings')
        .insert({ 
          church_name: churchName,
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

    console.log("Church name updated successfully:", data);
    return { data };
  } catch (error) {
    console.error('Error updating church name:', error);
    // Even if server update fails, we've already updated locally
    return { data: { church_name: churchName, updatedLocally: true } };
  }
}
