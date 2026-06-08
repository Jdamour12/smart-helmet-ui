import { http } from '@/lib/http';

export function alertReport(params: Record<string, string>) {
  return http(`/reports/alerts?${new URLSearchParams(params)}`);
}

export function sensorData(helmetId: string, params: Record<string, string>) {
  return http(`/reports/sensor-data/${helmetId}?${new URLSearchParams(params)}`);
}

export function generate(data: object) {
  return http('/reports/generate', { method: 'POST', body: JSON.stringify(data) });
}

export function exportReport(params: Record<string, string>) {
  return http(`/reports/export?${new URLSearchParams(params)}`);
}

export function auditLogs(params?: Record<string, string>) {
  const q = params ? '?' + new URLSearchParams(params) : '';
  return http(`/reports/audit-logs${q}`);
}
