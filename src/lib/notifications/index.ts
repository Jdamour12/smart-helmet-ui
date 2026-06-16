import { http } from '@/lib/http';
import type { Notification } from '@/lib/types';

function mapNotification(raw: any): Notification {
  return {
    id: raw.id,
    message: raw.message,
    level: raw.level ?? 'info',
    read: raw.read ?? raw.is_read ?? false,
    created_at: raw.created_at,
  };
}

export async function list(): Promise<Notification[]> {
  const raw = await http<any[]>('/notifications/');
  return raw.map(mapNotification);
}

export async function unreadCount(): Promise<{ count: number }> {
  const raw = await http<any>('/notifications/unread-count');
  return { count: raw.count ?? raw.unread_count ?? 0 };
}

export function readAll() {
  return http('/notifications/read-all', { method: 'PATCH' });
}

export function readOne(id: string) {
  return http(`/notifications/${id}/read`, { method: 'PATCH' });
}
