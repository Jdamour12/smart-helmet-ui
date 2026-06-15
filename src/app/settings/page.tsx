'use client';

import { useState, useEffect } from 'react';
import { Bell, Lock, Sliders, Save, RotateCcw } from 'lucide-react';
import { useSystemSettings } from '@/hooks/use-system';
import { useRouter } from 'next/navigation';

const DEFAULT_THRESHOLDS = {
  co_warning: 50,
  co_critical: 200,
  ch4_warning: 1.0,
  ch4_critical: 2.0,
  temp_warning: 40,
  temp_critical: 55,
};

const DEFAULT_NOTIFICATIONS = {
  critical: true,
  warning: true,
  info: false,
  email: true,
  sms: false,
};

const LS_THRESHOLDS    = 'helmet_thresholds';
const LS_NOTIFICATIONS = 'helmet_notifications';

export default function Settings() {
  const router = useRouter();
  const { data: systemRaw } = useSystemSettings();

  const [thresholds, setThresholds] = useState(DEFAULT_THRESHOLDS);
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);
  const [saved, setSaved] = useState(false);

  // Load persisted preferences on mount
  useEffect(() => {
    try {
      const t = localStorage.getItem(LS_THRESHOLDS);
      if (t) setThresholds({ ...DEFAULT_THRESHOLDS, ...JSON.parse(t) });
      const n = localStorage.getItem(LS_NOTIFICATIONS);
      if (n) setNotifications({ ...DEFAULT_NOTIFICATIONS, ...JSON.parse(n) });
    } catch { /* ignore parse errors */ }
  }, []);

  const system = systemRaw as Record<string, unknown> | undefined;

  const saveThresholds = () => {
    localStorage.setItem(LS_THRESHOLDS, JSON.stringify(thresholds));
    localStorage.setItem(LS_NOTIFICATIONS, JSON.stringify(notifications));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const resetToDefaults = () => {
    setThresholds(DEFAULT_THRESHOLDS);
    setNotifications(DEFAULT_NOTIFICATIONS);
    localStorage.removeItem(LS_THRESHOLDS);
    localStorage.removeItem(LS_NOTIFICATIONS);
  };

  const Toggle = ({
    on, onChange, color = 'bg-primary',
  }: { on: boolean; onChange: (v: boolean) => void; color?: string }) => (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={`w-12 h-7 rounded-full flex items-center px-1 transition-colors ${on ? color : 'bg-background-tertiary'}`}
    >
      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${on ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Settings</h2>
        <p className="text-foreground-secondary mt-1">Configure dashboard preferences and alert thresholds</p>
      </div>

      {/* System Info (from backend) */}
      {system && (
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-sm font-semibold text-foreground-secondary uppercase tracking-widest mb-4">System Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'App Name',     value: String(system.app_name ?? '—') },
              { label: 'Algorithm',    value: String(system.algorithm ?? '—') },
              { label: 'Token Expiry', value: `${system.access_token_expire_minutes ?? '—'} min` },
              { label: 'MQTT Host',    value: String(system.mqtt_broker_host ?? '—') },
              { label: 'MQTT Port',    value: String(system.mqtt_broker_port ?? '—') },
              { label: 'Debug Mode',   value: system.debug ? 'Enabled' : 'Disabled' },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 bg-background rounded-lg border border-border/50">
                <p className="text-xs text-foreground-tertiary font-medium">{label}</p>
                <p className="text-sm font-semibold text-foreground mt-1">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notification Settings */}
      <div className="bg-background-secondary border border-border rounded-lg p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border/50">
          <Bell className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Alert Notifications</h3>
        </div>

        <div className="space-y-4">
          {[
            { key: 'critical' as const, label: 'Critical Alerts',  desc: 'Immediate notification for critical events', color: 'bg-critical' },
            { key: 'warning'  as const, label: 'Warning Alerts',   desc: 'Notification for warning level events',     color: 'bg-warning'  },
            { key: 'info'     as const, label: 'Info Alerts',      desc: 'Notification for informational messages',   color: 'bg-info'     },
          ].map(({ key, label, desc, color }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-foreground font-medium">{label}</p>
                <p className="text-foreground-secondary text-sm">{desc}</p>
              </div>
              <Toggle
                on={notifications[key]}
                onChange={v => setNotifications(n => ({ ...n, [key]: v }))}
                color={color}
              />
            </div>
          ))}

          <div className="pt-4 border-t border-border/50">
            <p className="text-foreground-secondary text-sm mb-3">Notification Channels</p>
            <div className="space-y-3">
              {[
                { key: 'email' as const, label: 'Email notifications' },
                { key: 'sms'   as const, label: 'SMS notifications'   },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications[key]}
                    onChange={e => setNotifications(n => ({ ...n, [key]: e.target.checked }))}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-foreground text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alert Thresholds */}
      <div className="bg-background-secondary border border-border rounded-lg p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border/50">
          <Sliders className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Alert Thresholds</h3>
          <span className="text-xs text-foreground-tertiary ml-auto">Saved locally · applied on the dashboard</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'CO Level (ppm)',  warnKey: 'co_warning',   critKey: 'co_critical',   step: 1,   warnDefault: 50,  critDefault: 200, warnLabel: 'Warning (default: 50 ppm)',  critLabel: 'Critical (default: 200 ppm)' },
            { title: 'CH4 Level (%)',   warnKey: 'ch4_warning',  critKey: 'ch4_critical',  step: 0.1, warnDefault: 1.0, critDefault: 2.0, warnLabel: 'Warning (default: 1.0%)',    critLabel: 'Critical (default: 2.0%)'   },
            { title: 'Temperature (°C)',warnKey: 'temp_warning', critKey: 'temp_critical', step: 1,   warnDefault: 40,  critDefault: 55,  warnLabel: 'Warning (default: 40°C)',   critLabel: 'Critical (default: 55°C)'   },
          ].map(({ title, warnKey, critKey, step, warnLabel, critLabel }) => (
            <div key={title} className="space-y-4">
              <p className="font-semibold text-foreground">{title}</p>
              <div>
                <label className="text-foreground-secondary text-sm mb-2 block">{warnLabel}</label>
                <input
                  type="number" step={step}
                  value={thresholds[warnKey as keyof typeof thresholds]}
                  onChange={e => setThresholds(t => ({ ...t, [warnKey]: Number(e.target.value) }))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground
                    focus:outline-none focus:ring-2 focus:ring-warning/30 focus:border-warning transition-colors"
                />
              </div>
              <div>
                <label className="text-foreground-secondary text-sm mb-2 block">{critLabel}</label>
                <input
                  type="number" step={step}
                  value={thresholds[critKey as keyof typeof thresholds]}
                  onChange={e => setThresholds(t => ({ ...t, [critKey]: Number(e.target.value) }))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground
                    focus:outline-none focus:ring-2 focus:ring-critical/30 focus:border-critical transition-colors"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-border/50 flex items-center gap-3">
          <button
            onClick={saveThresholds}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg
              font-medium hover:bg-primary-dark transition-colors"
          >
            <Save className="w-4 h-4" />
            {saved ? 'Saved!' : 'Save Settings'}
          </button>
          <button
            onClick={resetToDefaults}
            className="flex items-center gap-2 bg-background border border-border text-foreground px-6 py-2
              rounded-lg font-medium hover:bg-background-secondary transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </button>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-background-secondary border border-border rounded-lg p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border/50">
          <Lock className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Security</h3>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => router.push('/dashboard/profile')}
            className="w-full text-left p-4 bg-background border border-border rounded-lg hover:border-primary/50 transition-colors"
          >
            <p className="text-foreground font-medium">Change Password</p>
            <p className="text-foreground-secondary text-sm mt-1">Update your account password</p>
          </button>

          <div className="p-4 bg-background border border-border rounded-lg opacity-60 cursor-not-allowed">
            <p className="text-foreground font-medium">Two-Factor Authentication</p>
            <p className="text-foreground-secondary text-sm mt-1">Coming soon — backend support required</p>
          </div>

          <button
            onClick={() => router.push('/dashboard/profile')}
            className="w-full text-left p-4 bg-background border border-border rounded-lg hover:border-primary/50 transition-colors"
          >
            <p className="text-foreground font-medium">Session Management</p>
            <p className="text-foreground-secondary text-sm mt-1">View your profile and active session</p>
          </button>
        </div>
      </div>
    </div>
  );
}
