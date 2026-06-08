'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as gatewaysApi from '@/lib/gateways';
import type { Gateway } from '@/lib/types';

export function useGateways() {
  return useQuery({
    queryKey: ['gateways'],
    queryFn: gatewaysApi.list,
  });
}

export function useGateway(id: string) {
  return useQuery({
    queryKey: ['gateways', id],
    queryFn: () => gatewaysApi.get(id),
    enabled: !!id,
  });
}

export function useGatewayHelmets(id: string) {
  return useQuery({
    queryKey: ['gateways', id, 'helmets'],
    queryFn: () => gatewaysApi.helmets(id),
    enabled: !!id,
  });
}

export function useCreateGateway() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Gateway>) => gatewaysApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gateways'] }),
  });
}

export function useUpdateGateway() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Gateway> }) => gatewaysApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gateways'] }),
  });
}

export function useDeleteGateway() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => gatewaysApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gateways'] }),
  });
}
