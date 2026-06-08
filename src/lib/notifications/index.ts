import { http } from '@/lib/http';
import type { Notification } from '@/lib/types';

export function list() {
  return http<Notification[]>('/notifications');
}

export function unreadCount() {
  return http<{ count: number }>('/notifications/unread-count');
}

export function readAll() {
  return http('/notifications/read-all', { method: 'PATCH' });
}

export function readOne(id: string) {
  return http(`/notifications/${id}/read`, { method: 'PATCH' });
}
