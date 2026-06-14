'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as helmetsApi from '@/lib/helmets';
import type { Helmet, SensorReading } from '@/lib/types';

export function useHelmets(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['helmets', params],
    queryFn: () => helmetsApi.list(params),
  });
}

export function useHelmetsWithReadings(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['helmets', 'with-readings', params],
    queryFn: () => helmetsApi.listWithReadings(params),
    refetchInterval: 15 * 1000,
  });
}

export function useHelmet(id: string) {
  return useQuery({
    queryKey: ['helmets', id],
    queryFn: () => helmetsApi.get(id),
    enabled: !!id,
  });
}

export function useHelmetSensorData(id: string) {
  return useQuery({
    queryKey: ['helmets', id, 'sensor-data'],
    queryFn: () => helmetsApi.sensorData(id),
    enabled: !!id,
    refetchInterval: 10 * 1000,
  });
}

export function useCreateHelmet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Helmet>) => helmetsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['helmets'] });
    },
  });
}

export function useUpdateHelmet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Helmet> }) => helmetsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['helmets'] });
    },
  });
}

export function useDeleteHelmet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => helmetsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['helmets'] });
    },
  });
}

export function usePushReading() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SensorReading> }) =>
      helmetsApi.pushReading(id, data),
  });
}
