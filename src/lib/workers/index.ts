import { http } from '@/lib/http';
import type { Worker, Helmet } from '@/lib/types';

export function list(params?: Record<string, string>) {
  const q = params ? '?' + new URLSearchParams(params) : '';
  return http<Worker[]>(`/workers${q}`);
}

export function get(id: string) {
  return http<Worker>(`/workers/${id}`);
}

export function create(data: Partial<Worker> & { name?: string; department?: string; department_id?: string }) {
  return http<Worker>('/workers', {
    method: 'POST',
    body: JSON.stringify({
      full_name: data.name ?? (data as any).full_name,
      employee_id: `WRK-${Date.now().toString(36).toUpperCase().slice(-6)}`,
      zone: data.department,
      department_id: data.department_id ?? (data as any).department_id ?? undefined,
      phone: data.phone,
      supervisor_id: (data as any).supervisor_id ?? undefined,
    }),
  });
}

export function update(id: string, data: Partial<Worker> & { name?: string; department?: string; department_id?: string }) {
  return http<Worker>(`/workers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      full_name: data.name ?? (data as any).full_name,
      zone: data.department,
      department_id: data.department_id ?? (data as any).department_id ?? undefined,
      phone: data.phone,
      is_active: data.status !== undefined ? data.status === 'active' : undefined,
      supervisor_id: (data as any).supervisor_id ?? undefined,
    }),
  });
}

export function remove(id: string) {
  return http(`/workers/${id}`, { method: 'DELETE' });
}

export function helmets(id: string) {
  return http<Helmet[]>(`/workers/${id}/helmets`);
}
