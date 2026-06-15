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
  last_update: string;
  step_count?: number;
  heading_deg?: number;
  est_zone?: string;
  ai_prediction?: 'safe' | 'danger' | 'unknown';
  ai_confidence?: number;
  ai_danger_votes?: number;
  ai_model_votes?: {
    isolation_forest?: string;
    random_forest?: string;
    lstm?: string;
    svm?: string;
  };
}

export interface SensorReading {
  temperature?: number;
  humidity?: number;
  gas_level?: number;
  co_ppm?: number;
  ch4_percent?: number;
  vibration_detected: boolean;
  helmet_worn: boolean;
  accelerometer_x?: number;
  accelerometer_y?: number;
  accelerometer_z?: number;
  gyro_x?: number;
  gyro_y?: number;
  gyro_z?: number;
  ir_value?: number;
  battery_level?: number;
  signal_strength?: number;
  step_count?: number;
  heading_deg?: number;
  est_zone?: string;
  ai_prediction?: 'safe' | 'danger' | 'unknown';
  ai_confidence?: number;
  ai_danger_votes?: number;
  ai_model_votes?: {
    isolation_forest?: string;
    random_forest?: string;
    lstm?: string;
    svm?: string;
  } | Record<string, string>;
  recorded_at?: string;
}

export interface AIResult {
  prediction: 'safe' | 'danger' | 'unknown';
  confidence: number;
  danger_votes: number;
  model_votes: {
    isolation_forest: string;
    random_forest: string;
    lstm: string;
    svm: string;
  };
}

export interface Worker {
  id: string;
  name: string;
  email: string;
  department: string;
  department_id?: string;
  phone?: string;
  status: 'active' | 'inactive';
  supervisor_id?: string;
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
  created_at?: string;
  last_active?: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  location?: string;
  is_active: boolean;
  status?: 'active' | 'inactive';
  worker_count?: number;
  created_at?: string;
  updated_at?: string;
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
