'use client';

import { useState } from 'react';
import { Bell, Lock, Eye, Sliders } from 'lucide-react';

export default function Settings() {
  const [notifications, setNotifications] = useState({
    critical: true,
    warning: true,
    info: false,
  });

  const [thresholds, setThresholds] = useState({
    co_warning: 20,
    co_critical: 40,
    ch4_warning: 0.8,
    ch4_critical: 1.5,
    temp_warning: 30,
    temp_critical: 35,
  });

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Settings</h2>
        <p className="text-foreground-secondary mt-1">Configure dashboard preferences and alert thresholds</p>
      </div>

      {/* Display Settings */}
      <div className="bg-background-secondary border border-border rounded-lg p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border/50">
          <Eye className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Display Preferences</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">Dark Mode</p>
              <p className="text-foreground-secondary text-sm">Always enabled for mining operations</p>
            </div>
            <div className="w-12 h-7 bg-primary rounded-full flex items-center px-1">
              <div className="w-5 h-5 bg-white rounded-full ml-auto"></div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">Real-time Updates</p>
              <p className="text-foreground-secondary text-sm">Auto-refresh every 5 seconds</p>
            </div>
            <div className="w-12 h-7 bg-primary rounded-full flex items-center px-1">
              <div className="w-5 h-5 bg-white rounded-full ml-auto"></div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">Compact View</p>
              <p className="text-foreground-secondary text-sm">Show less spacing between elements</p>
            </div>
            <div className="w-12 h-7 bg-background-tertiary rounded-full flex items-center px-1">
              <div className="w-5 h-5 bg-foreground-secondary rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-background-secondary border border-border rounded-lg p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border/50">
          <Bell className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Alert Notifications</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">Critical Alerts</p>
              <p className="text-foreground-secondary text-sm">Immediate notification for critical events</p>
            </div>
            <div className="w-12 h-7 bg-critical rounded-full flex items-center px-1">
              <div className="w-5 h-5 bg-white rounded-full ml-auto"></div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">Warning Alerts</p>
              <p className="text-foreground-secondary text-sm">Notification for warning level events</p>
            </div>
            <div className="w-12 h-7 bg-primary rounded-full flex items-center px-1">
              <div className="w-5 h-5 bg-white rounded-full ml-auto"></div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">Info Alerts</p>
              <p className="text-foreground-secondary text-sm">Notification for informational messages</p>
            </div>
            <div className="w-12 h-7 bg-background-tertiary rounded-full flex items-center px-1">
              <div className="w-5 h-5 bg-foreground-secondary rounded-full"></div>
            </div>
          </div>

          <div className="pt-4 border-t border-border/50">
            <p className="text-foreground-secondary text-sm mb-3">Notification Methods</p>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-foreground text-sm">In-app notifications</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-foreground text-sm">Email notifications</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-foreground text-sm">SMS notifications</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Thresholds */}
      <div className="bg-background-secondary border border-border rounded-lg p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border/50">
          <Sliders className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Alert Thresholds</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CO Thresholds */}
          <div className="space-y-4">
            <p className="font-semibold text-foreground">CO Level (ppm)</p>
            <div>
              <label className="text-foreground-secondary text-sm mb-2 block">Warning Threshold</label>
              <input
                type="number"
                value={thresholds.co_warning}
                onChange={(e) => setThresholds({...thresholds, co_warning: Number(e.target.value)})}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground"
              />
              <p className="text-foreground-tertiary text-xs mt-1">Default: 20 ppm</p>
            </div>
            <div>
              <label className="text-foreground-secondary text-sm mb-2 block">Critical Threshold</label>
              <input
                type="number"
                value={thresholds.co_critical}
                onChange={(e) => setThresholds({...thresholds, co_critical: Number(e.target.value)})}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground"
              />
              <p className="text-foreground-tertiary text-xs mt-1">Default: 40 ppm</p>
            </div>
          </div>

          {/* CH4 Thresholds */}
          <div className="space-y-4">
            <p className="font-semibold text-foreground">CH4 Level (%)</p>
            <div>
              <label className="text-foreground-secondary text-sm mb-2 block">Warning Threshold</label>
              <input
                type="number"
                step="0.1"
                value={thresholds.ch4_warning}
                onChange={(e) => setThresholds({...thresholds, ch4_warning: Number(e.target.value)})}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground"
              />
              <p className="text-foreground-tertiary text-xs mt-1">Default: 0.8%</p>
            </div>
            <div>
              <label className="text-foreground-secondary text-sm mb-2 block">Critical Threshold</label>
              <input
                type="number"
                step="0.1"
                value={thresholds.ch4_critical}
                onChange={(e) => setThresholds({...thresholds, ch4_critical: Number(e.target.value)})}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground"
              />
              <p className="text-foreground-tertiary text-xs mt-1">Default: 1.5%</p>
            </div>
          </div>

          {/* Temperature Thresholds */}
          <div className="space-y-4">
            <p className="font-semibold text-foreground">Temperature (°C)</p>
            <div>
              <label className="text-foreground-secondary text-sm mb-2 block">Warning Threshold</label>
              <input
                type="number"
                value={thresholds.temp_warning}
                onChange={(e) => setThresholds({...thresholds, temp_warning: Number(e.target.value)})}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground"
              />
              <p className="text-foreground-tertiary text-xs mt-1">Default: 30°C</p>
            </div>
            <div>
              <label className="text-foreground-secondary text-sm mb-2 block">Critical Threshold</label>
              <input
                type="number"
                value={thresholds.temp_critical}
                onChange={(e) => setThresholds({...thresholds, temp_critical: Number(e.target.value)})}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground"
              />
              <p className="text-foreground-tertiary text-xs mt-1">Default: 35°C</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border/50">
          <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors">
            Save Thresholds
          </button>
          <button className="ml-3 bg-background border border-border text-foreground px-6 py-2 rounded-lg font-medium hover:bg-background-secondary transition-colors">
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
          <button className="w-full text-left p-4 bg-background border border-border rounded-lg hover:border-primary/50 transition-colors">
            <p className="text-foreground font-medium">Change Password</p>
            <p className="text-foreground-secondary text-sm mt-1">Update your account password</p>
          </button>
          <button className="w-full text-left p-4 bg-background border border-border rounded-lg hover:border-primary/50 transition-colors">
            <p className="text-foreground font-medium">Two-Factor Authentication</p>
            <p className="text-foreground-secondary text-sm mt-1">Enable 2FA for additional security</p>
          </button>
          <button className="w-full text-left p-4 bg-background border border-border rounded-lg hover:border-primary/50 transition-colors">
            <p className="text-foreground font-medium">Session Management</p>
            <p className="text-foreground-secondary text-sm mt-1">View and manage active sessions</p>
          </button>
        </div>
      </div>
    </div>
  );
}
