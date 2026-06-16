'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as workersApi from '@/lib/workers';
import type { Worker } from '@/lib/types';

export function useWorkers(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['workers', params],
    queryFn: () => workersApi.list(params),
  });
}

export function useWorker(id: string) {
  return useQuery({
    queryKey: ['workers', id],
    queryFn: () => workersApi.get(id),
    enabled: !!id,
  });
}

export function useWorkerHelmets(id: string) {
  return useQuery({
    queryKey: ['workers', id, 'helmets'],
    queryFn: () => workersApi.helmets(id),
    enabled: !!id,
  });
}

export function useCreateWorker() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Worker>) => workersApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['workers'] }),
  });
}

export function useUpdateWorker() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Worker> }) => workersApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['workers'] }),
  });
}

export function useDeleteWorker() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => workersApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['workers'] }),
  });
}

export function usePromoteWorker() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => workersApi.promote(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workers'] });
      qc.invalidateQueries({ queryKey: ['supervisors'] });
      qc.invalidateQueries({ queryKey: ['helmets'] });
    },
  });
}
