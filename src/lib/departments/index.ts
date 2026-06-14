import { http } from '@/lib/http';
import type { Department, Worker } from '@/lib/types';
import { mapWorker } from '@/lib/workers';

export function list() {
  return http<Department[]>('/departments');
}

export function get(id: string) {
  return http<Department>(`/departments/${id}`);
}

export function create(data: { name: string; description?: string; location?: string }) {
  return http<Department>('/departments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function update(id: string, data: { name?: string; description?: string; location?: string; is_active?: boolean }) {
  return http<Department>(`/departments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function remove(id: string) {
  return http(`/departments/${id}`, { method: 'DELETE' });
}

export async function workers(id: string): Promise<Worker[]> {
  const raw = await http<any[]>(`/departments/${id}/workers`);
  return raw.map(mapWorker);
}
