import { http } from '@/lib/http';
import type { Helmet, SensorReading } from '@/lib/types';

export function list(params?: Record<string, string>) {
  const q = params ? '?' + new URLSearchParams(params) : '';
  return http<Helmet[]>(`/helmets${q}`);
}

export function get(id: string) {
  return http<Helmet>(`/helmets/${id}`);
}

export function create(data: Partial<Helmet>) {
  return http<Helmet>('/helmets', { method: 'POST', body: JSON.stringify(data) });
}

export function update(id: string, data: Partial<Helmet>) {
  return http<Helmet>(`/helmets/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
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
