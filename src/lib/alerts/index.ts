import { http } from '@/lib/http';
import type { Alert } from '@/lib/types';

export function list(params?: Record<string, string>) {
  const q = params ? '?' + new URLSearchParams(params) : '';
  return http<Alert[]>(`/alerts${q}`);
}

export function feed() {
  return http<Alert[]>('/alerts/feed');
}

export function unresolved() {
  return http<Alert[]>('/alerts/unresolved');
}

export function create(data: Partial<Alert>) {
  return http<Alert>('/alerts', { method: 'POST', body: JSON.stringify(data) });
}

export function resolve(id: string) {
  return http(`/alerts/${id}/resolve`, { method: 'PATCH' });
}

export function remove(id: string) {
  return http(`/alerts/${id}`, { method: 'DELETE' });
}
