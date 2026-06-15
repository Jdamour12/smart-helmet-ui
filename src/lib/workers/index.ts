import { http } from '@/lib/http';
import type { Worker, Helmet } from '@/lib/types';
import { mapHelmet } from '@/lib/helmets';

export function mapWorker(raw: any): Worker {
  return {
    id: raw.id,
    name: raw.full_name ?? raw.name ?? '',
    email: raw.email ?? raw.user?.email ?? '',
    department: raw.department ?? raw.zone ?? '',
    department_id: raw.department_id,
    phone: raw.phone,
    status: (raw.status ?? (raw.is_active ? 'active' : 'inactive')) as 'active' | 'inactive',
    supervisor_id: raw.supervisor_id,
  };
}

export async function list(params?: Record<string, string>): Promise<Worker[]> {
  const q = params ? '?' + new URLSearchParams(params) : '';
  const raw = await http<any[]>(`/workers${q}`);
  return raw.map(mapWorker);
}

export async function get(id: string): Promise<Worker> {
  const raw = await http<any>(`/workers/${id}`);
  return mapWorker(raw);
}

export function create(data: Partial<Worker> & { name?: string; department?: string; department_id?: string }) {
  return http<any>('/workers', {
    method: 'POST',
    body: JSON.stringify({
      full_name: data.name ?? (data as any).full_name,
      employee_id: `WRK-${Date.now().toString(36).toUpperCase().slice(-6)}`,
      zone: data.department,
      department_id: data.department_id ?? (data as any).department_id ?? undefined,
      phone: data.phone,
      supervisor_id: (data as any).supervisor_id ?? undefined,
    }),
  }).then(mapWorker);
}

export function update(id: string, data: Partial<Worker> & { name?: string; department?: string; department_id?: string }) {
  return http<any>(`/workers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      full_name: data.name ?? (data as any).full_name,
      zone: data.department,
      department_id: data.department_id ?? (data as any).department_id ?? undefined,
      phone: data.phone,
      is_active: data.status !== undefined ? data.status === 'active' : undefined,
      supervisor_id: (data as any).supervisor_id ?? undefined,
    }),
  }).then(mapWorker);
}

export function remove(id: string) {
  return http(`/workers/${id}`, { method: 'DELETE' });
}

export async function helmets(id: string): Promise<Helmet[]> {
  const raw = await http<any[]>(`/workers/${id}/helmets`);
  return raw.map(mapHelmet);
}
