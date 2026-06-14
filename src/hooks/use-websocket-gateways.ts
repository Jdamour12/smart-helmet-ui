'use client';

import { useEffect, useState } from 'react';
import { gatewaysUrl } from '@/lib/ws';
import { mapGateway } from '@/lib/gateways';
import type { Gateway } from '@/lib/types';

interface GatewaysWsPayload {
  type?: string;
  gateways?: Array<{
    id: string;
    name: string;
    is_online: boolean;
    location?: string;
    ip_address?: string;
    packet_delivery_rate?: number;
    last_seen?: string;
  }>;
}

export function useGatewaysLive() {
  const [data, setData] = useState<Gateway[]>([]);

  useEffect(() => {
    const ws = new WebSocket(gatewaysUrl());
    ws.onmessage = (e) => {
      try {
        const payload = JSON.parse(e.data) as GatewaysWsPayload;
        if (payload.gateways) {
          setData(payload.gateways.map(mapGateway));
        }
      } catch { /* ignore */ }
    };
    ws.onerror = () => ws.close();

    return () => ws.close();
  }, []);

  return data;
}
