'use client';

import { useEffect, useState } from 'react';
import { alertsUrl } from '@/lib/ws';
import type { Alert } from '@/lib/types';

interface AlertsWsPayload {
  type?: string;
  count?: number;
  alerts?: Array<{
    id: string;
    level: string;
    type: string;
    message: string;
    helmet_id?: string;
    created_at: string;
  }>;
}

function mapWsAlert(raw: {
  id: string;
  level: string;
  type: string;
  message: string;
  helmet_id?: string;
  created_at: string;
  worker_name?: string;
  resolved?: boolean;
}): Alert {
  return {
    id: raw.id,
    helmet_id: raw.helmet_id ?? '',
    worker_name: raw.worker_name ?? 'Alert',
    type: raw.type,
    level: raw.level as Alert['level'],
    message: raw.message,
    timestamp: raw.created_at,
    resolved: raw.resolved ?? false,
  };
}

export function useAlertsLive() {
  const [data, setData] = useState<Alert[]>([]);

  useEffect(() => {
    const ws = new WebSocket(alertsUrl());
    ws.onmessage = (e) => {
      try {
        const payload = JSON.parse(e.data) as AlertsWsPayload;
        if (payload.alerts) {
          setData(payload.alerts.map(mapWsAlert));
        }
      } catch { /* ignore */ }
    };
    ws.onerror = () => ws.close();

    return () => ws.close();
  }, []);

  return data;
}
