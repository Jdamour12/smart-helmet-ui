import { http } from '@/lib/http';

export function summary() {
  return http('/analytics/summary');
}

export function alertTrends(days?: number) {
  return http(`/analytics/alert-trends${days ? `?days=${days}` : ''}`);
}

export function alertsByType() {
  return http('/analytics/alerts-by-type');
}

export function alertsByLevel() {
  return http('/analytics/alerts-by-level');
}

export function gasLevels() {
  return http('/analytics/gas-levels');
}

export function compliance() {
  return http('/analytics/compliance');
}

export function complianceWeeklyTrend() {
  return http('/analytics/compliance/weekly-trend');
}

export function impacts() {
  return http('/analytics/impacts');
}

export function impactsWeeklyTrend() {
  return http('/analytics/impacts/weekly-trend');
}

export function environment() {
  return http('/analytics/environment');
}

export function networkHealth() {
  return http('/analytics/network-health');
}

export function activeSessions() {
  return http('/analytics/active-sessions');
}

export function usageTrends() {
  return http('/analytics/usage-trends');
}

export function departmentDistribution() {
  return http('/analytics/department-distribution');
}

export function peakHours() {
  return http('/analytics/peak-hours');
}

export function systemHealthTrends() {
  return http('/analytics/system-health-trends');
}
