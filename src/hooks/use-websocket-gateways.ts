'use client';

import { useEffect, useState } from 'react';
import { gatewaysUrl } from '@/lib/ws';
import type { Gateway } from '@/lib/types';

export function useGatewaysLive() {
  const [data, setData] = useState<Gateway[]>([]);

  useEffect(() => {
    const ws = new WebSocket(gatewaysUrl());
    ws.onmessage = (e) => {
      try { setData(JSON.parse(e.data) as Gateway[]); } catch { /* ignore */ }
    };
    ws.onerror = () => ws.close();

    return () => ws.close();
  }, []);

  return data;
}
