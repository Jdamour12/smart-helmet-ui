'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as systemApi from '@/lib/system';

export function useSystemHealth() {
  return useQuery({
    queryKey: ['system', 'health'],
    queryFn: systemApi.health,
    refetchInterval: 30 * 1000,
  });
}

export function useSystemPerformance() {
  return useQuery({
    queryKey: ['system', 'performance'],
    queryFn: systemApi.performance,
    refetchInterval: 30 * 1000,
  });
}

export function useSystemSettings() {
  return useQuery({
    queryKey: ['system', 'settings'],
    queryFn: systemApi.settings,
  });
}

export function useUpdateSystemSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: object) => systemApi.updateSettings(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['system', 'settings'] }),
  });
}
