import { http } from '@/lib/http';
import type { Worker, Helmet, Supervisor } from '@/lib/types';
import { mapHelmet } from '@/lib/helmets';

function mapPromotedSupervisor(raw: any): Supervisor {
  return {
    id: raw.id,
    name: raw.full_name ?? raw.name ?? '',
    email: raw.email ?? raw.user?.email ?? '',
    department: raw.department ?? '',
    location: raw.location,
    phone: raw.phone,
    status: (raw.status ?? (raw.is_active ? 'active' : 'inactive')) as 'active' | 'inactive',
    worker_count: raw.worker_count ?? 0,
    created_at: raw.created_at,
    last_active: raw.last_active ?? raw.updated_at,
  };
}

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
  const raw = await http<any>(`/workers/${q}`);
  if (!raw) return [];
  const arr = Array.isArray(raw) ? raw : (raw.results ?? raw.data ?? raw.workers ?? []);
  return arr.map(mapWorker);
}

export async function get(id: string): Promise<Worker> {
  const raw = await http<any>(`/workers/${id}`);
  return mapWorker(raw);
}

export function create(data: Partial<Worker> & { name?: string; department?: string; department_id?: string }) {
  // Build body — omit undefined values so backend validation doesn't choke
  const supervisorId = (data as any).supervisor_id;
  const body: Record<string, any> = {
    full_name: data.name ?? (data as any).full_name ?? '',
    employee_id: `WRK-${Date.now().toString(36).toUpperCase().slice(-6)}`,
    zone: data.department ?? undefined,
    phone: data.phone ?? undefined,
  };
  if (data.email) body.email = data.email;
  if (data.department_id) body.department_id = data.department_id;
  if (supervisorId) body.supervisor_id = supervisorId;

  // Use trailing slash to avoid redirect (which strips CORS headers)
  return http<any>('/workers/', {
    method: 'POST',
    body: JSON.stringify(body),
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

export function promote(id: string): Promise<Supervisor> {
  return http<any>(`/workers/${id}/promote`, { method: 'POST' }).then(mapPromotedSupervisor);
}
