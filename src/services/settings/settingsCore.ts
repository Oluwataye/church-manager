
import { supabase } from "@/integrations/supabase/client";

export interface ChurchSettings {
  logo_url?: string;
  church_name?: string;
}

/**
 * Fetch church settings from local storage (offline mode)
 */
export function getLocalSettings(): ChurchSettings {
  return {
    logo_url: localStorage.getItem('offlineLogo') || undefined,
    church_name: localStorage.getItem('churchName') || 'LIVING FAITH CHURCH'
  };
}

/**
 * Fetch church settings from the server
 */
export async function fetchChurchSettings(): Promise<ChurchSettings> {
  try {
    console.log("Fetching church settings");
    
    // First check if we're offline
    if (!navigator.onLine) {
      console.log("Device is offline, using local settings");
      return getLocalSettings();
    }
    
    const { data, error } = await supabase
      .from('church_settings')
      .select('logo_url, church_name')
      .single();
    
    if (error) {
      console.error("Error fetching church settings:", error);
      // If no settings exist, create default settings
      if (error.code === 'PGRST116') {
        await createDefaultSettings();
        return { logo_url: undefined, church_name: 'LIVING FAITH CHURCH' };
      }
      
      // Fall back to local settings on error
      return getLocalSettings();
    }
    
    console.log("Settings fetched:", data);
    
    // Update local storage with the latest data
    if (data?.church_name) {
      localStorage.setItem('churchName', data.church_name);
    }
    if (data?.logo_url) {
      localStorage.setItem('offlineLogo', data.logo_url);
    }
    
    return data;
  } catch (error) {
    console.error("Error in fetchChurchSettings:", error);
    return getLocalSettings();
  }
}

/**
 * Create default settings in the database
 */
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
