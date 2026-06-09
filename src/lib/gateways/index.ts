import { http } from '@/lib/http';
import type { Gateway, Helmet } from '@/lib/types';

export function list() {
  return http<Gateway[]>('/gateways');
}

export function get(id: string) {
  return http<Gateway>(`/gateways/${id}`);
}

export function create(data: Partial<Gateway> & { name?: string }) {
  return http<Gateway>('/gateways', {
    method: 'POST',
    body: JSON.stringify({
      name: data.name || data.id || data.location || 'Gateway',
      location: data.location,
      ip_address: data.ip_address,
      status: data.status,
    }),
  });
}

export function update(id: string, data: Partial<Gateway>) {
  return http<Gateway>(`/gateways/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      location: data.location,
      ip_address: data.ip_address,
      status: data.status,
    }),
  });
}

export function remove(id: string) {
  return http(`/gateways/${id}`, { method: 'DELETE' });
}

export function status(id: string) {
  return http(`/gateways/${id}/status`);
}

export function helmets(id: string) {
  return http<Helmet[]>(`/gateways/${id}/helmets`);
}
