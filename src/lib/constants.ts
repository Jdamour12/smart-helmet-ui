import type { ThresholdConfig } from './types';

export const DEFAULT_THRESHOLDS: ThresholdConfig = {
  coWarning: 35,
  coCritical: 1200,
  ch4Warning: 1.25,
  ch4Critical: 5.0,
  tempWarning: 35,
  tempCritical: 45,
  humidityWarning: 85,
  humidityCritical: 95,
  impactDetectionSensitivity: 0.8,
};

export const ALERT_MESSAGES = {
  coHigh: 'High CO levels detected',
  coCritical: 'CRITICAL: Dangerous CO levels',
  ch4High: 'High methane levels detected',
  ch4Critical: 'CRITICAL: Dangerous methane levels',
  tempHigh: 'High temperature alert',
  tempCritical: 'CRITICAL: Extreme heat',
  humidityHigh: 'High humidity levels',
  humidityCritical: 'CRITICAL: Extreme humidity',
  helmetNotWorn: 'Helmet not worn',
  impactDetected: 'Impact/Fall detected',
  signalWeak: 'Weak signal - moving to edge of coverage',
  signalLost: 'CRITICAL: Signal lost',
  batteryLow: 'Low battery level',
  batteryCritical: 'CRITICAL: Battery critical',
} as const;

export const METRIC_DEFINITIONS = {
  co: {
    name: 'Carbon Monoxide (CO)',
    unit: 'ppm',
    description: 'Toxic gas produced by incomplete combustion',
    safeLevel: 35,
    warningLevel: 200,
    criticalLevel: 1200,
  },
  ch4: {
    name: 'Methane (CH4)',
    unit: '%',
    description: 'Flammable gas that accumulates in mine shafts',
    safeLevel: 0.5,
    warningLevel: 1.25,
    criticalLevel: 5.0,
  },
  temperature: {
    name: 'Temperature',
    unit: '°C',
    description: 'Ambient temperature in the mining area',
    safeLevel: 25,
    warningLevel: 35,
    criticalLevel: 45,
  },
  humidity: {
    name: 'Humidity',
    unit: '%',
    description: 'Relative humidity in the mining area',
    safeLevel: 60,
    warningLevel: 85,
    criticalLevel: 95,
  },
};

export const COLORS = {
  primary: '#0f172a',
  secondary: '#1e293b',
  accent: '#f97316',
  safe: '#22c55e',
  warning: '#eab308',
  danger: '#ef4444',
  muted: '#94a3b8',
  border: '#cbd5e1',
  background: '#f8fafc',
  card: '#ffffff',
};

export const DOCS_PAGES = [
  {
    slug: 'system-overview',
    title: 'System Overview',
    description: 'How the smart helmet system works',
  },
  {
    slug: 'metrics',
    title: 'Metric Definitions',
    description: 'Understanding each sensor and safe thresholds',
  },
  {
    slug: 'alerts',
    title: 'Alert Levels',
    description: 'Alert severity levels and what they mean',
  },
  {
    slug: 'emergency',
    title: 'Emergency Procedures',
    description: 'How to respond to critical alerts',
  },
  {
    slug: 'guide',
    title: 'User Guide',
    description: 'How to use the dashboard',
  },
];
