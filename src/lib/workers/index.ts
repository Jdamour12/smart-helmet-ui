import { http } from '@/lib/http';
import type { Worker, Helmet } from '@/lib/types';

export function list(params?: Record<string, string>) {
  const q = params ? '?' + new URLSearchParams(params) : '';
  return http<Worker[]>(`/workers${q}`);
}

export function get(id: string) {
  return http<Worker>(`/workers/${id}`);
}

export function create(data: Partial<Worker>) {
  return http<Worker>('/workers', { method: 'POST', body: JSON.stringify(data) });
}

export function update(id: string, data: Partial<Worker>) {
  return http<Worker>(`/workers/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export function remove(id: string) {
  return http(`/workers/${id}`, { method: 'DELETE' });
}

export function helmets(id: string) {
  return http<Helmet[]>(`/workers/${id}/helmets`);
}
