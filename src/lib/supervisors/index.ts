import { http } from '@/lib/http';
import type { Supervisor, Worker, Gateway } from '@/lib/types';

export function list() {
  return http<Supervisor[]>('/supervisors');
}

export function get(id: string) {
  return http<Supervisor>(`/supervisors/${id}`);
}

export function create(data: Partial<Supervisor>) {
  return http<Supervisor>('/supervisors', { method: 'POST', body: JSON.stringify(data) });
}

export function update(id: string, data: Partial<Supervisor>) {
  return http<Supervisor>(`/supervisors/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export function remove(id: string) {
  return http(`/supervisors/${id}`, { method: 'DELETE' });
}

export function workers(id: string) {
  return http<Worker[]>(`/supervisors/${id}/workers`);
}

export function gateways(id: string) {
  return http<Gateway[]>(`/supervisors/${id}/gateways`);
}
