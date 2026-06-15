import { http } from '@/lib/http';
import type { Supervisor, Worker } from '@/lib/types';
import { mapWorker } from '@/lib/workers';

function mapSupervisor(raw: any): Supervisor {
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

export async function list(): Promise<Supervisor[]> {
  const raw = await http<any[]>('/supervisors');
  return raw.map(mapSupervisor);
}

export async function get(id: string): Promise<Supervisor> {
  const raw = await http<any>(`/supervisors/${id}`);
  return mapSupervisor(raw);
}

export function create(data: Partial<Supervisor>) {
  return http<any>('/supervisors', {
    method: 'POST',
    body: JSON.stringify({
      full_name: data.name,
      email: data.email,
      phone: data.phone,
    }),
  }).then(mapSupervisor);
}

export function update(id: string, data: Partial<Supervisor>) {
  return http<any>(`/supervisors/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      full_name: data.name,
      phone: data.phone,
      is_active: data.status !== undefined ? data.status === 'active' : undefined,
    }),
  }).then(mapSupervisor);
}

export function remove(id: string) {
  return http(`/supervisors/${id}`, { method: 'DELETE' });
}

export async function workers(id: string): Promise<Worker[]> {
  const raw = await http<any[]>(`/supervisors/${id}/workers`);
  return raw.map(mapWorker);
}
