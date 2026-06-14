import { http } from '@/lib/http';
import type { Alert } from '@/lib/types';

function mapAlert(raw: any): Alert {
  return {
    id: raw.id,
    helmet_id: raw.helmet_id ?? '',
    worker_name: raw.worker_name ?? 'Alert',
    type: raw.type ?? 'unknown',
    level: raw.level ?? 'info',
    message: raw.message ?? '',
    timestamp: raw.created_at ?? raw.timestamp ?? '',
    resolved: raw.is_resolved ?? raw.resolved ?? false,
  };
}

function resolveBy(): string {
  if (typeof window === 'undefined') return 'admin';
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.name || user.email || 'admin';
  } catch {
    return 'admin';
  }
}

export async function list(params?: Record<string, string>): Promise<Alert[]> {
  const q = params ? '?' + new URLSearchParams(params) : '';
  const raw = await http<any[]>(`/alerts${q}`);
  return raw.map(mapAlert);
}

export async function feed(): Promise<Alert[]> {
  const raw = await http<any[]>('/alerts/feed');
  return raw.map(mapAlert);
}

export async function unresolved(): Promise<Alert[]> {
  const raw = await http<any[]>('/alerts/unresolved');
  return raw.map(mapAlert);
}

export function create(data: Partial<Alert>) {
  return http<Alert>('/alerts', { method: 'POST', body: JSON.stringify(data) });
}

export async function resolve(id: string, resolvedBy?: string): Promise<Alert> {
  const raw = await http<any>(`/alerts/${id}/resolve`, {
    method: 'PATCH',
    body: JSON.stringify({ resolved_by: resolvedBy ?? resolveBy() }),
  });
  return mapAlert(raw);
}

export function remove(id: string) {
  return http(`/alerts/${id}`, { method: 'DELETE' });
}
