import { http } from '@/lib/http';
import type { Helmet, SensorReading } from '@/lib/types';

function mapHelmet(raw: any): Helmet {
  return {
    id: raw.id,
    worker_id: raw.worker_id ?? '',
    worker_name: raw.worker_name ?? raw.helmet_code ?? 'Unassigned',
    status: raw.status === 'active' ? 'active'
      : raw.status === 'critical' || raw.status === 'warning' ? 'alarm'
      : 'inactive',
    co: raw.co ?? 0,
    ch4: raw.ch4 ?? 0,
    temperature: raw.temperature ?? 0,
    humidity: raw.humidity ?? 0,
    helmet_wear: raw.helmet_wear ?? false,
    impact_detected: raw.impact_detected ?? false,
    battery: raw.battery ?? 0,
    signal_strength: raw.signal_strength ?? 0,
    gateway_id: raw.gateway_id ?? '',
    last_update: raw.last_update ?? raw.last_seen ?? raw.updated_at ?? '',
  };
}

export async function list(params?: Record<string, string>): Promise<Helmet[]> {
  const q = params ? '?' + new URLSearchParams(params) : '';
  const raw = await http<any[]>(`/helmets${q}`);
  return raw.map(mapHelmet);
}

export async function get(id: string): Promise<Helmet> {
  const raw = await http<any>(`/helmets/${id}`);
  return mapHelmet(raw);
}

export function create(data: Partial<Helmet> & { helmet_code?: string; worker_id?: string }) {
  return http<any>('/helmets', {
    method: 'POST',
    body: JSON.stringify({
      helmet_code: data.helmet_code ?? `HLM-${Date.now().toString(36).toUpperCase().slice(-6)}`,
      zone: (data as any).zone ?? undefined,
      gateway_id: data.gateway_id || undefined,
      worker_id: data.worker_id || undefined,
    }),
  });
}

export function update(id: string, data: Partial<Helmet>) {
  return http<any>(`/helmets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      gateway_id: data.gateway_id || undefined,
      worker_id: data.worker_id || undefined,
      status: data.status === 'alarm' ? 'critical'
        : data.status === 'active' ? 'active'
        : data.status === 'inactive' ? 'inactive'
        : undefined,
    }),
  });
}

export function remove(id: string) {
  return http(`/helmets/${id}`, { method: 'DELETE' });
}

export function sensorData(id: string) {
  return http<SensorReading[]>(`/helmets/${id}/sensor-data`);
}

export function pushReading(id: string, data: Partial<SensorReading>) {
  return http(`/helmets/${id}/readings`, { method: 'POST', body: JSON.stringify(data) });
}
