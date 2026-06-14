import { http } from '@/lib/http';
import type { Gateway, Helmet } from '@/lib/types';
import { mapHelmet } from '@/lib/helmets';

export function mapGateway(raw: any): Gateway {
  const status = raw.status ?? (raw.is_online ? 'online' : 'offline');
  return {
    id: raw.id,
    name: raw.name,
    location: raw.location ?? '',
    status: status as 'online' | 'offline',
    connected_helmets: raw.connected_helmets ?? 0,
    signal_strength: raw.signal_strength ?? 0,
    last_heartbeat: raw.last_heartbeat ?? raw.last_seen ?? '',
    ip_address: raw.ip_address,
  };
}

export async function list(): Promise<Gateway[]> {
  const raw = await http<any[]>('/gateways');
  return raw.map(mapGateway);
}

export async function get(id: string): Promise<Gateway> {
  const raw = await http<any>(`/gateways/${id}`);
  return mapGateway(raw);
}

export function create(data: Partial<Gateway> & { name?: string }) {
  return http<any>('/gateways', {
    method: 'POST',
    body: JSON.stringify({
      name: data.name || data.id || data.location || 'Gateway',
      location: data.location,
      ip_address: data.ip_address,
      status: data.status,
    }),
  }).then(mapGateway);
}

export function update(id: string, data: Partial<Gateway>) {
  return http<any>(`/gateways/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      name: data.name,
      location: data.location,
      ip_address: data.ip_address,
      status: data.status,
    }),
  }).then(mapGateway);
}

export function remove(id: string) {
  return http(`/gateways/${id}`, { method: 'DELETE' });
}

export function status(id: string) {
  return http(`/gateways/${id}/status`);
}

export async function helmets(id: string): Promise<Helmet[]> {
  const raw = await http<any[]>(`/gateways/${id}/helmets`);
  return raw.map(mapHelmet);
}
