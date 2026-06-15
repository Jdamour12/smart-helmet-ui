'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import * as reportsApi from '@/lib/reports';
import type { AuditLog } from '@/lib/types';

export function useAuditLogs(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['reports', 'audit-logs', params],
    queryFn: () => reportsApi.auditLogs(params),
  });
}

export function useGenerateReport() {
  return useMutation({
    mutationFn: (data: object) => reportsApi.generate(data),
  });
}

