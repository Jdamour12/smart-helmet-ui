'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as supervisorsApi from '@/lib/supervisors';
import type { Supervisor } from '@/lib/types';

export function useSupervisors() {
  return useQuery({
    queryKey: ['supervisors'],
    queryFn: supervisorsApi.list,
  });
}

export function useSupervisor(id: string) {
  return useQuery({
    queryKey: ['supervisors', id],
    queryFn: () => supervisorsApi.get(id),
    enabled: !!id,
  });
}

export function useSupervisorWorkers(id: string) {
  return useQuery({
    queryKey: ['supervisors', id, 'workers'],
    queryFn: () => supervisorsApi.workers(id),
    enabled: !!id,
  });
}

export function useCreateSupervisor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Supervisor>) => supervisorsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['supervisors'] }),
  });
}

export function useUpdateSupervisor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Supervisor> }) =>
      supervisorsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['supervisors'] }),
  });
}

export function useDeleteSupervisor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => supervisorsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['supervisors'] }),
  });
}
