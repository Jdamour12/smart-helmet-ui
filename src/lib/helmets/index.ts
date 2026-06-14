import { http } from '@/lib/http';
import type { Helmet, SensorReading } from '@/lib/types';

export function mapHelmet(raw: any, latest?: any): Helmet {
  const reading = latest ?? raw.latest_reading;
  return {
    id: raw.id,
    worker_id: raw.worker_id ?? '',
    worker_name: raw.worker_name ?? raw.helmet_code ?? 'Unassigned',
    status: raw.status === 'active' ? 'active'
      : raw.status === 'critical' || raw.status === 'warning' ? 'alarm'
      : 'inactive',
    co: reading?.co_ppm ?? raw.co ?? 0,
    ch4: reading?.ch4_percent ?? raw.ch4 ?? 0,
    temperature: reading?.temperature ?? raw.temperature ?? 0,
    humidity: reading?.humidity ?? raw.humidity ?? 0,
    helmet_wear: reading?.helmet_worn ?? raw.helmet_wear ?? false,
    impact_detected: reading?.vibration_detected ?? raw.impact_detected ?? false,
    battery: reading?.battery_level ?? raw.battery ?? 0,
    signal_strength: reading?.signal_strength ?? raw.signal_strength ?? 0,
    gateway_id: raw.gateway_id ?? '',
    last_update: reading?.recorded_at ?? raw.last_update ?? raw.last_seen ?? raw.updated_at ?? '',
  };
}

function mergeLatestReading(helmet: Helmet, latest: any): Helmet {
  if (!latest) return helmet;
  return {
    ...helmet,
    co: latest.co_ppm ?? helmet.co,
    ch4: latest.ch4_percent ?? helmet.ch4,
    temperature: latest.temperature ?? helmet.temperature,
    humidity: latest.humidity ?? helmet.humidity,
    helmet_wear: latest.helmet_worn ?? helmet.helmet_wear,
    impact_detected: latest.vibration_detected ?? helmet.impact_detected,
    battery: latest.battery_level ?? helmet.battery,
    signal_strength: latest.signal_strength ?? helmet.signal_strength,
    last_update: latest.recorded_at ?? helmet.last_update,
  };
}

export async function list(params?: Record<string, string>): Promise<Helmet[]> {
  const q = params ? '?' + new URLSearchParams(params) : '';
  const raw = await http<any[]>(`/helmets${q}`);
  return raw.map((h) => mapHelmet(h));
}

export async function listWithReadings(params?: Record<string, string>): Promise<Helmet[]> {
  const helmets = await list(params);
  if (!helmets.length) return helmets;

  const readings = await Promise.all(
    helmets.map((h) =>
      http<any[]>(`/helmets/${h.id}/sensor-data?limit=1`).catch(() => []),
    ),
  );

  return helmets.map((h, i) => mergeLatestReading(h, readings[i]?.[0]));
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
