const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

function saveToken(token: string) {
  localStorage.setItem('token', token);
  // also set as cookie so middleware can read it
  document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

function clearToken() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  document.cookie = 'token=; path=/; max-age=0';
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    clearToken();
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || 'Request failed');
  }

  if (res.status === 204) return null as T;
  return res.json();
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export const auth = {
  login: (email: string, password: string, role: string) =>
    request<{ access_token: string; token_type: string; user: User }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password, role }) }
    ),

  logout: () => request('/auth/logout', { method: 'POST' }),

  me: () => request<User>('/auth/me'),

  forgotPassword: (email: string) =>
    request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

  resetPassword: (token: string, password: string) =>
    request('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) }),

  updateMe: (data: Partial<User>) =>
    request<User>('/auth/me', { method: 'PATCH', body: JSON.stringify(data) }),

  changePassword: (currentPassword: string, newPassword: string) =>
    request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    }),

  uploadAvatar: (file: File) => {
    const form = new FormData();
    form.append('avatar', file);
    const token = getToken();
    return fetch(`${BASE_URL}/auth/me/avatar`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    }).then(r => r.json());
  },
};

// ─── Helmets ─────────────────────────────────────────────────────────────────

export const helmets = {
  list: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<Helmet[]>(`/helmets${q}`);
  },
  get: (id: string) => request<Helmet>(`/helmets/${id}`),
  create: (data: Partial<Helmet>) =>
    request<Helmet>('/helmets', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Helmet>) =>
    request<Helmet>(`/helmets/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) => request(`/helmets/${id}`, { method: 'DELETE' }),
  sensorData: (id: string) => request<SensorReading>(`/helmets/${id}/sensor-data`),
  pushReading: (id: string, data: SensorReading) =>
    request(`/helmets/${id}/readings`, { method: 'POST', body: JSON.stringify(data) }),
};

// ─── Workers ─────────────────────────────────────────────────────────────────

export const workers = {
  list: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<Worker[]>(`/workers${q}`);
  },
  get: (id: string) => request<Worker>(`/workers/${id}`),
  create: (data: Partial<Worker>) =>
    request<Worker>('/workers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Worker>) =>
    request<Worker>(`/workers/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) => request(`/workers/${id}`, { method: 'DELETE' }),
  helmets: (id: string) => request<Helmet[]>(`/workers/${id}/helmets`),
};

// ─── Supervisors ─────────────────────────────────────────────────────────────

export const supervisors = {
  list: () => request<Supervisor[]>('/supervisors'),
  get: (id: string) => request<Supervisor>(`/supervisors/${id}`),
  create: (data: Partial<Supervisor>) =>
    request<Supervisor>('/supervisors', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Supervisor>) =>
    request<Supervisor>(`/supervisors/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) => request(`/supervisors/${id}`, { method: 'DELETE' }),
  workers: (id: string) => request<Worker[]>(`/supervisors/${id}/workers`),
  gateways: (id: string) => request<Gateway[]>(`/supervisors/${id}/gateways`),
};

// ─── Gateways ─────────────────────────────────────────────────────────────────

export const gateways = {
  list: () => request<Gateway[]>('/gateways'),
  get: (id: string) => request<Gateway>(`/gateways/${id}`),
  create: (data: Partial<Gateway>) =>
    request<Gateway>('/gateways', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Gateway>) =>
    request<Gateway>(`/gateways/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) => request(`/gateways/${id}`, { method: 'DELETE' }),
  status: (id: string) => request(`/gateways/${id}/status`),
  helmets: (id: string) => request<Helmet[]>(`/gateways/${id}/helmets`),
};

// ─── Alerts ───────────────────────────────────────────────────────────────────

export const alerts = {
  list: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<Alert[]>(`/alerts${q}`);
  },
  feed: () => request<Alert[]>('/alerts/feed'),
  unresolved: () => request<Alert[]>('/alerts/unresolved'),
  create: (data: Partial<Alert>) =>
    request<Alert>('/alerts', { method: 'POST', body: JSON.stringify(data) }),
  resolve: (id: string) => request(`/alerts/${id}/resolve`, { method: 'PATCH' }),
  delete: (id: string) => request(`/alerts/${id}`, { method: 'DELETE' }),
};

// ─── Analytics ───────────────────────────────────────────────────────────────

export const analytics = {
  summary: () => request('/analytics/summary'),
  adminStats: () => request('/admin/stats'),
  alertTrends: (days?: number) =>
    request(`/analytics/alert-trends${days ? `?days=${days}` : ''}`),
  alertsByType: () => request('/analytics/alerts-by-type'),
  alertsByLevel: () => request('/analytics/alerts-by-level'),
  gasLevels: () => request('/analytics/gas-levels'),
  compliance: () => request('/analytics/compliance'),
  complianceWeeklyTrend: () => request('/analytics/compliance/weekly-trend'),
  impacts: () => request('/analytics/impacts'),
  impactsWeeklyTrend: () => request('/analytics/impacts/weekly-trend'),
  environment: () => request('/analytics/environment'),
  networkHealth: () => request('/analytics/network-health'),
  activeSessions: () => request('/analytics/active-sessions'),
  usageTrends: () => request('/analytics/usage-trends'),
  departmentDistribution: () => request('/analytics/department-distribution'),
  peakHours: () => request('/analytics/peak-hours'),
  systemHealthTrends: () => request('/analytics/system-health-trends'),
  supervisorDistribution: () => request('/analytics/supervisor-distribution'),
};

// ─── Reports ─────────────────────────────────────────────────────────────────

export const reports = {
  alerts: (params: Record<string, string>) =>
    request(`/reports/alerts?${new URLSearchParams(params)}`),
  sensorData: (helmetId: string, params: Record<string, string>) =>
    request(`/reports/sensor-data/${helmetId}?${new URLSearchParams(params)}`),
  generate: (data: object) =>
    request('/reports/generate', { method: 'POST', body: JSON.stringify(data) }),
  export: (params: Record<string, string>) =>
    request(`/reports/export?${new URLSearchParams(params)}`),
  auditLogs: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return request(`/reports/audit-logs${q}`);
  },
};

// ─── System ───────────────────────────────────────────────────────────────────

export const system = {
  health: () => request('/system/health'),
  performance: () => request('/system/performance'),
  settings: () => request('/system/settings'),
  updateSettings: (data: object) =>
    request('/system/settings', { method: 'PUT', body: JSON.stringify(data) }),
};

// ─── Notifications ────────────────────────────────────────────────────────────

export const notifications = {
  list: () => request<Notification[]>('/notifications'),
  readAll: () => request('/notifications/read-all', { method: 'PATCH' }),
};

// ─── Token helpers (used by login/logout) ────────────────────────────────────

export { saveToken, clearToken, getToken };

// ─── Types (local shapes matching backend responses) ─────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'supervisor' | 'admin';
  phone?: string;
  department?: string;
  location?: string;
  bio?: string;
  avatar_url?: string;
}

export interface Helmet {
  id: string;
  worker_id: string;
  worker_name: string;
  status: 'active' | 'inactive' | 'alarm';
  co: number;
  ch4: number;
  temperature: number;
  humidity: number;
  helmet_wear: boolean;
  impact_detected: boolean;
  battery: number;
  signal_strength: number;
  gateway_id: string;
  last_update: string;
}

export interface SensorReading {
  co: number;
  ch4: number;
  temperature: number;
  humidity: number;
  helmet_wear: boolean;
  impact_detected: boolean;
  battery: number;
  signal_strength: number;
}

export interface Worker {
  id: string;
  name: string;
  email: string;
  department: string;
  phone?: string;
  status: 'active' | 'inactive';
  supervisor_id?: string;
  gateway_id?: string;
}

export interface Supervisor {
  id: string;
  name: string;
  email: string;
  department: string;
  status: 'active' | 'inactive';
  worker_count?: number;
  gateway_count?: number;
}

export interface Gateway {
  id: string;
  location: string;
  status: 'online' | 'offline';
  connected_helmets: number;
  signal_strength: number;
  last_heartbeat: string;
}

export interface Alert {
  id: string;
  helmet_id: string;
  worker_name: string;
  type: string;
  level: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
  resolved: boolean;
}

export interface Notification {
  id: string;
  message: string;
  level: 'critical' | 'warning' | 'info';
  read: boolean;
  created_at: string;
}
