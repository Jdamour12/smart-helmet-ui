'use client';

import { useEffect, useState } from 'react';
import { helmetUrl } from '@/lib/ws';
import type { SensorReading } from '@/lib/types';

export function useHelmetLive(helmetId: string | null) {
  const [data, setData] = useState<SensorReading | null>(null);

  useEffect(() => {
    if (!helmetId) return;

    const ws = new WebSocket(helmetUrl(helmetId));
    ws.onmessage = (e) => {
      try { setData(JSON.parse(e.data) as SensorReading); } catch { /* ignore */ }
    };
    ws.onerror = () => ws.close();

    return () => ws.close();
  }, [helmetId]);

  return data;
}
