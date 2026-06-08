import { WS_BASE } from '@/lib/http';

export function helmetUrl(helmetId: string) {
  return `${WS_BASE}/helmets/${helmetId}`;
}

export function alertsUrl() {
  return `${WS_BASE}/alerts`;
}

export function gatewaysUrl() {
  return `${WS_BASE}/gateways`;
}
