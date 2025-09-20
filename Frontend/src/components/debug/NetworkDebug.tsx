import React, { useEffect, useState } from 'react';

interface NetworkInfo {
  hostname: string;
  protocol: string;
  port: string;
  apiUrl: string;
  resolvedApiUrl: string;
}

export const NetworkDebug: React.FC = () => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const baseApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      
      // Same logic as in api.ts
      const resolveApiUrl = (baseUrl: string): string => {
        try {
          const currentHost = window.location.hostname;
          const currentProtocol = window.location.protocol;
          
          if (currentHost !== 'localhost' && currentHost !== '127.0.0.1' && /^\d+\.\d+\.\d+\.\d+$/.test(currentHost)) {
            const urlObj = new URL(baseUrl);
            return `${currentProtocol}//${currentHost}:${urlObj.port || '3000'}${urlObj.pathname}`;
          }
          
          return baseUrl;
        } catch (error) {
          console.warn('Error resolving API URL:', error);
          return baseUrl;
        }
      };

      const info: NetworkInfo = {
        hostname: window.location.hostname,
        protocol: window.location.protocol,
        port: window.location.port,
        apiUrl: baseApiUrl,
        resolvedApiUrl: resolveApiUrl(baseApiUrl),
      };

      setNetworkInfo(info);
      console.log('Network Debug Info:', info);
    }
  }, []);

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  if (!networkInfo) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 10,
      right: 10,
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      fontFamily: 'monospace',
      maxWidth: '300px'
    }}>
      <div><strong>Debug Info:</strong></div>
      <div>Host: {networkInfo.hostname}</div>
      <div>Protocol: {networkInfo.protocol}</div>
      <div>Port: {networkInfo.port || 'default'}</div>
      <div>API URL: {networkInfo.apiUrl}</div>
      <div>Resolved API: {networkInfo.resolvedApiUrl}</div>
    </div>
  );
};