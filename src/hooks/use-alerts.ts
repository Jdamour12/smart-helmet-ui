'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as alertsApi from '@/lib/alerts';
import type { Alert } from '@/lib/types';

export function useAlerts(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['alerts', params],
    queryFn: () => alertsApi.list(params),
  });
}

export function useAlertFeed() {
  return useQuery({
    queryKey: ['alerts', 'feed'],
    queryFn: alertsApi.feed,
    refetchInterval: 30 * 1000,
  });
}

export function useUnresolvedAlerts() {
  return useQuery({
    queryKey: ['alerts', 'unresolved'],
    queryFn: alertsApi.unresolved,
    refetchInterval: 30 * 1000,
  });
}

export function useCreateAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Alert>) => alertsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['alerts'] }),
  });
}

export function useResolveAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => alertsApi.resolve(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['alerts'] }),
  });
}

export function useDeleteAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => alertsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['alerts'] }),
  });
}
