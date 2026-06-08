'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';
import { clearToken } from '@/lib/http';

const IDLE_TIMEOUT_MS  = 30 * 60 * 1000; // 30 minutes
const WARN_BEFORE_MS   = 60 * 1000;       // warn 60 seconds before

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router           = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile]       = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown]     = useState(60);
  const idleTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warnTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const doLogout = useCallback(() => {
    clearToken();
    router.replace('/login');
  }, [router]);

  const startIdleTimers = useCallback(() => {
    if (idleTimer.current)  clearTimeout(idleTimer.current);
    if (warnTimer.current)  clearTimeout(warnTimer.current);
    if (countTimer.current) clearInterval(countTimer.current);
    setShowWarning(false);

    // Show warning before auto-logout
    warnTimer.current = setTimeout(() => {
      setShowWarning(true);
      setCountdown(60);
      countTimer.current = setInterval(() => {
        setCountdown(c => {
          if (c <= 1) {
            clearInterval(countTimer.current!);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }, IDLE_TIMEOUT_MS - WARN_BEFORE_MS);

    // Auto-logout
    idleTimer.current = setTimeout(doLogout, IDLE_TIMEOUT_MS);
  }, [doLogout]);

  useEffect(() => {
    // ── Auth guard ──────────────────────────────────────────
    const token = localStorage.getItem('token');
    if (!token) { router.replace('/login'); return; }

    // ── Back-button protection ──────────────────────────────
    // Replace current history entry so going back won't show this page after logout
    const onPopState = () => {
      if (!localStorage.getItem('token')) {
        router.replace('/login');
      }
    };
    window.addEventListener('popstate', onPopState);

    // ── Mobile resize ───────────────────────────────────────
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // ── Idle timeout ────────────────────────────────────────
    const resetEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    const reset = () => startIdleTimers();
    resetEvents.forEach(e => window.addEventListener(e, reset, { passive: true }));
    startIdleTimers();

    // ── Cross-tab logout ────────────────────────────────────
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'token' && !e.newValue) doLogout();
    };
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('resize', checkMobile);
      resetEvents.forEach(e => window.removeEventListener(e, reset));
      window.removeEventListener('storage', onStorage);
      if (idleTimer.current)  clearTimeout(idleTimer.current);
      if (warnTimer.current)  clearTimeout(warnTimer.current);
      if (countTimer.current) clearInterval(countTimer.current);
    };
  }, [router, startIdleTimers, doLogout]);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => { if (isMobile) setSidebarOpen(false); }} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      {/* Idle warning modal */}
      {showWarning && (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center">
          <div className="bg-background-secondary border border-border rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center mx-auto">
              <span className="text-3xl font-bold text-warning">{countdown}</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground">Session Expiring</h3>
            <p className="text-sm text-foreground-secondary">
              You've been inactive. You will be logged out automatically in {countdown} second{countdown !== 1 ? 's' : ''}.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowWarning(false); startIdleTimers(); }}
                className="flex-1 px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary-dark transition-colors">
                Stay Logged In
              </button>
              <button
                onClick={doLogout}
                className="flex-1 px-4 py-2.5 text-sm font-medium border border-border text-foreground-secondary rounded-lg hover:bg-background-tertiary transition-colors">
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
