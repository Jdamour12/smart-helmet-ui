'use client';

import { useQuery } from '@tanstack/react-query';
import * as analyticsApi from '@/lib/analytics';

export function useAnalyticsSummary() {
  return useQuery({
    queryKey: ['analytics', 'summary'],
    queryFn: analyticsApi.summary,
    refetchInterval: 60 * 1000,
  });
}

export function useAlertTrends(days?: number) {
  return useQuery({
    queryKey: ['analytics', 'alert-trends', days],
    queryFn: () => analyticsApi.alertTrends(days),
  });
}

export function useAlertsByType() {
  return useQuery({
    queryKey: ['analytics', 'alerts-by-type'],
    queryFn: analyticsApi.alertsByType,
  });
}

export function useAlertsByLevel() {
  return useQuery({
    queryKey: ['analytics', 'alerts-by-level'],
    queryFn: analyticsApi.alertsByLevel,
  });
}

export function useGasLevels() {
  return useQuery({
    queryKey: ['analytics', 'gas-levels'],
    queryFn: analyticsApi.gasLevels,
    refetchInterval: 60 * 1000,
  });
}

export function useCompliance() {
  return useQuery({
    queryKey: ['analytics', 'compliance'],
    queryFn: analyticsApi.compliance,
    refetchInterval: 60 * 1000,
  });
}

export function useComplianceWeeklyTrend() {
  return useQuery({
    queryKey: ['analytics', 'compliance-weekly-trend'],
    queryFn: analyticsApi.complianceWeeklyTrend,
  });
}

export function useImpacts() {
  return useQuery({
    queryKey: ['analytics', 'impacts'],
    queryFn: analyticsApi.impacts,
    refetchInterval: 60 * 1000,
  });
}

export function useImpactsWeeklyTrend() {
  return useQuery({
    queryKey: ['analytics', 'impacts-weekly-trend'],
    queryFn: analyticsApi.impactsWeeklyTrend,
  });
}

export function useEnvironment() {
  return useQuery({
    queryKey: ['analytics', 'environment'],
    queryFn: analyticsApi.environment,
    refetchInterval: 60 * 1000,
  });
}

export function useNetworkHealth() {
  return useQuery({
    queryKey: ['analytics', 'network-health'],
    queryFn: analyticsApi.networkHealth,
    refetchInterval: 30 * 1000,
  });
}

export function useActiveSessions() {
  return useQuery({
    queryKey: ['analytics', 'active-sessions'],
    queryFn: analyticsApi.activeSessions,
    refetchInterval: 60 * 1000,
  });
}

export function useUsageTrends() {
  return useQuery({
    queryKey: ['analytics', 'usage-trends'],
    queryFn: analyticsApi.usageTrends,
  });
}

export function useDepartmentDistribution() {
  return useQuery({
    queryKey: ['analytics', 'department-distribution'],
    queryFn: analyticsApi.departmentDistribution,
  });
}

export function usePeakHours() {
  return useQuery({
    queryKey: ['analytics', 'peak-hours'],
    queryFn: analyticsApi.peakHours,
  });
}

export function useSystemHealthTrends() {
  return useQuery({
    queryKey: ['analytics', 'system-health-trends'],
    queryFn: analyticsApi.systemHealthTrends,
  });
}
