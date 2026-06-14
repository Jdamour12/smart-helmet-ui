'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { useEffect } from 'react';
import { BASE_URL, saveToken, getToken } from '@/lib/http';
import type { QueryClient as QC } from '@tanstack/react-query';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // keep data fresh for real-time UI: no long staleness, poll frequently
            staleTime: 0,
            refetchInterval: 5 * 1000,
            retry: 1,
            refetchOnWindowFocus: true,
          },
        },
      }),
  );

  // Development helper: auto-login with seeded admin credentials so dev UI can
  // fetch real backend data without manual auth. Only runs in non-production.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    tryAutoLogin(client as unknown as QC);
  }, [client]);

  async function tryAutoLogin(qc: QC) {
    try {
      if (process.env.NODE_ENV === 'production') return;
      if (getToken()) return; // already authenticated
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@smarthelmet.com', password: 'admin123' }),
      });
      if (!res.ok) return;
      const body = await res.json();
      const token = (body as any).access_token ?? (body as any).token;
      if (token) {
        saveToken(token);
        // Refresh queries to pick up authenticated data
        try { qc.invalidateQueries(); } catch { /* ignore */ }
      }
    } catch (e) {
      // Ignore auto-login failures
    }
  }

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
