
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PendingSyncOperation {
  operation: string;
  data: any;
  timestamp: string;
}

// Function to process pending sync operations when app comes back online
export async function processPendingSync() {
  try {
    const pendingSyncString = localStorage.getItem('pendingSync');
    if (!pendingSyncString) return;
    
    const pendingSync = JSON.parse(pendingSyncString) as PendingSyncOperation[];
    if (pendingSync.length === 0) return;
    
    console.log(`Processing ${pendingSync.length} pending sync operations`);
    
    let successCount = 0;
    const errors = [];
    
    // Process each operation in order
    for (const operation of pendingSync) {
      try {
        switch (operation.operation) {
          case 'insert':
            // For inserts, remove the client-generated ID
            const insertData = { ...operation.data };
            delete insertData.id;
            
            const { error: insertError } = await supabase
              .from('members')
              .insert([insertData]);
              
            if (insertError) throw insertError;
            break;
            
          case 'update':
            const updateData = { ...operation.data };
            const updateId = updateData.id;
            delete updateData.id;
            
            const { error: updateError } = await supabase
              .from('members')
              .update(updateData)
              .eq('id', updateId);
              
            if (updateError) throw updateError;
            break;
            
          case 'delete':
            const { error: deleteError } = await supabase
              .from('members')
              .delete()
              .eq('id', operation.data.id);
              
            if (deleteError) throw deleteError;
            break;
            
          default:
            console.warn(`Unknown operation type: ${operation.operation}`);
        }
        
        successCount++;
      } catch (error) {
        console.error(`Error processing operation ${operation.operation}:`, error);
        errors.push(error);
      }
    }
    
    // Clear the pending sync operations after processing
    localStorage.removeItem('pendingSync');
    
    if (successCount > 0) {
      toast.success(`Synchronized ${successCount} offline changes`);
    }
    
    if (errors.length > 0) {
      toast.error(`Failed to sync ${errors.length} changes. They will be retried later.`);
    }
    
    return { successCount, errorCount: errors.length };
  } catch (error) {
    console.error('Error processing pending sync:', error);
    toast.error('Failed to sync offline changes. They will be retried later.');
    return { successCount: 0, errorCount: 1 };
  }
}

// Initialize sync listener
export function initSyncListener() {
  const handleOnline = async () => {
    console.log('Connection restored. Processing pending sync operations...');
    await processPendingSync();
  };
  
  window.addEventListener('online', handleOnline);
  
  return () => {
    window.removeEventListener('online', handleOnline);
  };
}
