export type AlertLevel = 'critical' | 'warning' | 'info';

export interface Helmet {
  id: string;
  workerId: string;
  workerName: string;
  status: 'active' | 'inactive' | 'alarm';
  co: number;
  ch4: number;
  temperature: number;
  humidity: number;
  helmetWear: boolean;
  impactDetected: boolean;
  battery: number;
  signalStrength: number;
  gatewayId: string;
  lastUpdate: Date;
}

export interface Alert {
  id: string;
  helmetId: string;
  workerName: string;
  type: string;
  level: AlertLevel;
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export interface Gateway {
  id: string;
  location: string;
  status: 'online' | 'offline';
  connectedHelmets: number;
  signalStrength: number;
  lastHeartbeat: Date;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  timestamp?: Date;
}

export interface SystemStats {
  totalHelmets: number;
  activeHelmets: number;
  criticalAlerts: number;
  avgGasLevel: number;
  complianceRate: number;
}
