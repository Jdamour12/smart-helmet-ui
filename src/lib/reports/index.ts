import { http, BASE_URL, getToken } from '@/lib/http';

export function generate(data: object) {
  return http('/reports/generate', { method: 'POST', body: JSON.stringify(data) });
}

export function auditLogs(params?: Record<string, string>) {
  const q = params ? '?' + new URLSearchParams(params) : '';
  return http(`/reports/audit-logs${q}`);
}

/** Fetch a binary file from the API and trigger a browser download. */
export async function downloadFile(path: string, filename: string): Promise<void> {
  const token = getToken();
  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`${BASE_URL}${path}`, { headers });
  if (!res.ok) {
    const text = await res.text().catch(() => 'Download failed');
    throw new Error(text || 'Download failed');
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Download helpers for each report type */
export const download = {
  alerts:        (fmt: 'csv' | 'pdf') => downloadFile(`/reports/download/alerts?format=${fmt}`,        `alerts.${fmt}`),
  workers:       (fmt: 'csv' | 'pdf') => downloadFile(`/reports/download/workers?format=${fmt}`,       `workers.${fmt}`),
  safetySummary: ()                   => downloadFile('/reports/download/safety-summary',               'safety_summary.pdf'),
  sensorData:    (id: string, fmt: 'csv' | 'pdf') =>
    downloadFile(`/reports/download/sensor-data/${id}?format=${fmt}`, `sensor_data_${id}.${fmt}`),
};
