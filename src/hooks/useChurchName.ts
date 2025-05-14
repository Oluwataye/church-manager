
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchChurchSettings } from '@/services/churchSettings';

export function useChurchName() {
  const [churchName, setChurchName] = useState(() => {
    // Try to get the name from localStorage initially
    return localStorage.getItem('churchName') || 'LIVING FAITH CHURCH';
  });

  // Fetch from the server
  const { data: settings } = useQuery({
    queryKey: ['churchSettings'],
    queryFn: fetchChurchSettings,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    meta: {
      onSuccess: (data) => {
        if (data?.church_name) {
          setChurchName(data.church_name);
          localStorage.setItem('churchName', data.church_name);
        }
      }
    }
  });

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

  // Listen for localStorage changes
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'churchName' && event.newValue) {
        setChurchName(event.newValue);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return { 
    churchName,
    setChurchName
  };
}
