
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
    church_name: localStorage.getItem('churchName') || 'GLORY COMMUNITY CHRISTIAN CENTRE Kubwa'
  };
}

/**
 * Fetch church settings from the server
 */
export async function fetchChurchSettings(): Promise<ChurchSettings> {
  try {
    console.log("Fetching church settings");

    if (!navigator.onLine) {
      console.log("Device is offline, using local settings");
      return getLocalSettings();
    }

    // Always fetch the most recently updated row to avoid PGRST116 when multiple rows exist
    const { data, error } = await supabase
      .from('church_settings')
      .select('logo_url, church_name, updated_at')
      .order('updated_at', { ascending: false, nullsFirst: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching church settings:", error);
      // Fall back to local settings on error
      return getLocalSettings();
    }

    // If table is empty, fall back to default name and avoid inserting (RLS may block client inserts)
    if (!data) {
      return { logo_url: undefined, church_name: 'GLORY COMMUNITY CHRISTIAN CENTRE Kubwa' };
    }

    console.log("Settings fetched:", data);

    // Update local storage with the latest data
    if (data.church_name) {
      localStorage.setItem('churchName', data.church_name);
    }
    if (data.logo_url) {
      localStorage.setItem('offlineLogo', data.logo_url);
    }

    return { logo_url: data.logo_url, church_name: data.church_name };
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
          church_name: 'GLORY COMMUNITY CHRISTIAN CENTRE Kubwa',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
    
    if (error) throw error;
  } catch (error) {
    console.error("Error creating default settings:", error);
  }
}
