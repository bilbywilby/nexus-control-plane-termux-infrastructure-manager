import { useState, useEffect } from 'react';
import { toast } from 'sonner';
export function useNetwork() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineAt, setOfflineAt] = useState<number | null>(null);
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      const duration = offlineAt ? Math.round((Date.now() - offlineAt) / 1000) : 0;
      toast.success(`Connection restored. Re-syncing buffer... (${duration}s offline)`);
      setOfflineAt(null);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setOfflineAt(Date.now());
      toast.error("Network connection lost. Nexus entering degraded mode.");
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [offlineAt]);
  return {
    isOnline,
    offlineDuration: offlineAt ? Math.round((Date.now() - offlineAt) / 1000) : 0
  };
}