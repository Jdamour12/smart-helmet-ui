'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as departmentsApi from '@/lib/departments';
import type { Department } from '@/lib/types';

export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentsApi.list(),
  });
}

export function useDepartment(id: string) {
  return useQuery({
    queryKey: ['departments', id],
    queryFn: () => departmentsApi.get(id),
    enabled: !!id,
  });
}

export function useDepartmentWorkers(id: string) {
  return useQuery({
    queryKey: ['departments', id, 'workers'],
    queryFn: () => departmentsApi.workers(id),
    enabled: !!id,
  });
}

export function useCreateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; description?: string; location?: string }) =>
      departmentsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['departments'] }),
  });
}

export function useUpdateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Department> }) =>
      departmentsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['departments'] }),
  });
}

export function useDeleteDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => departmentsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['departments'] }),
  });
}
