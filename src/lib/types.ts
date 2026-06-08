export type AlertLevel = 'critical' | 'warning' | 'info';

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

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user?: User;
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
  temperature: number;
  humidity: number;
  gas_level: number;
  co_ppm: number;
  ch4_percent: number;
  vibration_detected: boolean;
  helmet_worn: boolean;
  accelerometer_x?: number;
  accelerometer_y?: number;
  accelerometer_z?: number;
  battery_level?: number;
  signal_strength?: number;
  recorded_at: string;
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
  location?: string;
  phone?: string;
  status: 'active' | 'inactive';
  worker_count?: number;
  gateway_count?: number;
  created_at?: string;
  last_active?: string;
}

export interface Gateway {
  id: string;
  location: string;
  status: 'online' | 'offline';
  connected_helmets: number;
  signal_strength: number;
  last_heartbeat: string;
  ip_address?: string;
}

export interface Alert {
  id: string;
  helmet_id: string;
  worker_name: string;
  type: string;
  level: AlertLevel;
  message: string;
  timestamp: string;
  resolved: boolean;
}

export interface Notification {
  id: string;
  message: string;
  level: AlertLevel;
  read: boolean;
  created_at: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  timestamp?: string;
}

export interface SystemStats {
  totalHelmets: number;
  activeHelmets: number;
  criticalAlerts: number;
  avgGasLevel: number;
  complianceRate: number;
  gatewaysOnline?: number;
  gatewaysTotal?: number;
  warningAlerts?: number;
}

export interface AuditLog {
  id: string;
  event: string;
  detail: string;
  status: string;
  timestamp: string;
}

export interface ThresholdConfig {
  coWarning: number;
  coCritical: number;
  ch4Warning: number;
  ch4Critical: number;
  tempWarning: number;
  tempCritical: number;
  humidityWarning: number;
  humidityCritical: number;
  impactDetectionSensitivity: number;
}

export type HelmetData = Helmet;
export type SystemStatus = SystemStats;
