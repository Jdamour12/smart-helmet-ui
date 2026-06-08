'use client';

import { useEffect, useState } from 'react';
import { alertsUrl } from '@/lib/ws';
import type { Alert } from '@/lib/types';

export function useAlertsLive() {
  const [data, setData] = useState<Alert[]>([]);

  useEffect(() => {
    const ws = new WebSocket(alertsUrl());
    ws.onmessage = (e) => {
      try { setData(JSON.parse(e.data) as Alert[]); } catch { /* ignore */ }
    };
    ws.onerror = () => ws.close();

    return () => ws.close();
  }, []);

  return data;
}
