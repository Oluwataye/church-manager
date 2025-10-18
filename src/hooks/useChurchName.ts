
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchChurchSettings } from '@/services/churchSettings';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export function useChurchName() {
  const { isOffline } = useOnlineStatus();
  const [churchName, setChurchName] = useState(() => {
    // Try to get the name from localStorage initially
    return localStorage.getItem('churchName') || 'Glory Cummunity Christian Centre Kubwa';
  });

  // Fetch from the server when online
  const { data: settings } = useQuery({
    queryKey: ['churchSettings'],
    queryFn: fetchChurchSettings,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    enabled: !isOffline, // Only run if online
  });

  // Update church name when server data changes
  useEffect(() => {
    if (settings?.church_name) {
      setChurchName(settings.church_name);
      localStorage.setItem('churchName', settings.church_name);
    }
  }, [settings]);

  // Listen for custom events
  useEffect(() => {
    const handleNameUpdated = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.churchName) {
        const newName = customEvent.detail.churchName;
        setChurchName(newName);
      }
    };
    
    window.addEventListener('churchNameUpdated', handleNameUpdated);
    return () => window.removeEventListener('churchNameUpdated', handleNameUpdated);
  }, []);

  // Listen for localStorage changes (works across tabs)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'churchName' && event.newValue) {
        setChurchName(event.newValue);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateLocalChurchName = (newName: string) => {
    if (!newName.trim()) return;
    
    // Update local state
    setChurchName(newName);
    
    // Store in localStorage
    localStorage.setItem('churchName', newName);
    
    // Dispatch event for other components
    const nameUpdatedEvent = new CustomEvent('churchNameUpdated', { 
      detail: { churchName: newName } 
    });
    window.dispatchEvent(nameUpdatedEvent);
  };

  return { 
    churchName,
    setChurchName: updateLocalChurchName
  };
}
