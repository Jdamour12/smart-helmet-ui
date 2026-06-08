import { http } from '@/lib/http';

export function health() {
  return http('/system/health');
}

export function performance() {
  return http('/system/performance');
}

export function settings() {
  return http('/system/settings');
}

export function updateSettings(data: object) {
  return http('/system/settings', { method: 'PUT', body: JSON.stringify(data) });
}
