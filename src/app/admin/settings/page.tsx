'use client';

import { useState } from 'react';
import { Bell, Sliders, Database, RotateCcw } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('notifications');

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'thresholds', label: 'Safety Thresholds', icon: Sliders },
    { id: 'maintenance', label: 'Maintenance', icon: Database },
  ];

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold text-foreground">System Settings</h2>
        <p className="text-foreground-secondary mt-1">Configure system-wide parameters</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-border">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors ${
                isActive
                  ? 'border-accent text-accent'
                  : 'border-transparent text-foreground-secondary hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-background-secondary border border-border rounded-lg p-6">
        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">System Notifications</h3>
              <p className="text-foreground-secondary text-sm mb-4">Configure how the system notifies supervisors and admins</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border/50">
                <div>
                  <p className="text-foreground font-medium">Critical Alert Notifications</p>
                  <p className="text-foreground-secondary text-sm">Alert supervisors of critical incidents</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 cursor-pointer" />
              </div>

              <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border/50">
                <div>
                  <p className="text-foreground font-medium">Email Notifications</p>
                  <p className="text-foreground-secondary text-sm">Send system alerts via email</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 cursor-pointer" />
              </div>

              <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border/50">
                <div>
                  <p className="text-foreground font-medium">SMS Alerts</p>
                  <p className="text-foreground-secondary text-sm">Send critical alerts via SMS</p>
                </div>
                <input type="checkbox" className="w-5 h-5 cursor-pointer" />
              </div>

              <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border/50">
                <div>
                  <p className="text-foreground font-medium">Daily Reports</p>
                  <p className="text-foreground-secondary text-sm">Send daily system activity summaries</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 cursor-pointer" />
              </div>
            </div>
          </div>
        )}

        {/* Safety Thresholds Tab */}
        {activeTab === 'thresholds' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Global Safety Thresholds</h3>
              <p className="text-foreground-secondary text-sm mb-4">Set system-wide alert thresholds for all operations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CO Level */}
              <div className="p-4 bg-background rounded-lg border border-border/50 space-y-3">
                <h4 className="font-semibold text-foreground">CO Level (ppm)</h4>
                <div>
                  <label className="text-foreground-secondary text-sm">Critical Threshold</label>
                  <input type="number" defaultValue="50" className="w-full mt-2 bg-background border border-border rounded-lg px-3 py-2 text-foreground" />
                </div>
              </div>

              {/* CH4 Level */}
              <div className="p-4 bg-background rounded-lg border border-border/50 space-y-3">
                <h4 className="font-semibold text-foreground">CH4 Level (%)</h4>
                <div>
                  <label className="text-foreground-secondary text-sm">Critical Threshold</label>
                  <input type="number" defaultValue="5" className="w-full mt-2 bg-background border border-border rounded-lg px-3 py-2 text-foreground" />
                </div>
              </div>

              {/* Temperature */}
              <div className="p-4 bg-background rounded-lg border border-border/50 space-y-3">
                <h4 className="font-semibold text-foreground">Temperature (°C)</h4>
                <div>
                  <label className="text-foreground-secondary text-sm">Warning Threshold</label>
                  <input type="number" defaultValue="40" className="w-full mt-2 bg-background border border-border rounded-lg px-3 py-2 text-foreground" />
                </div>
              </div>

              {/* Guidelines */}
              <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                <h4 className="font-semibold text-accent mb-2">Safety Standards</h4>
                <ul className="text-sm text-foreground-secondary space-y-1">
                  <li>• Critical thresholds trigger emergency response</li>
                  <li>• Aligned with mining safety regulations</li>
                  <li>• Apply globally to all mines</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Maintenance Tab */}
        {activeTab === 'maintenance' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">System Maintenance</h3>
              <p className="text-foreground-secondary text-sm mb-4">Perform system maintenance operations</p>
            </div>

            <div className="space-y-3">
              <button className="w-full flex items-center justify-between px-4 py-3 bg-background rounded-lg border border-border/50 hover:border-border transition-colors group">
                <div className="text-left">
                  <p className="text-foreground font-medium">Clean Old Logs</p>
                  <p className="text-sm text-foreground-tertiary">Remove logs older than 90 days</p>
                </div>
                <RotateCcw className="w-5 h-5 text-foreground-secondary group-hover:text-foreground transition-colors" />
              </button>

              <button className="w-full flex items-center justify-between px-4 py-3 bg-background rounded-lg border border-border/50 hover:border-border transition-colors group">
                <div className="text-left">
                  <p className="text-foreground font-medium">Backup Database</p>
                  <p className="text-sm text-foreground-tertiary">Create a complete system backup</p>
                </div>
                <RotateCcw className="w-5 h-5 text-foreground-secondary group-hover:text-foreground transition-colors" />
              </button>

              <button className="w-full flex items-center justify-between px-4 py-3 bg-background rounded-lg border border-border/50 hover:border-border transition-colors group">
                <div className="text-left">
                  <p className="text-foreground font-medium">Cache Refresh</p>
                  <p className="text-sm text-foreground-tertiary">Clear all system cached data</p>
                </div>
                <RotateCcw className="w-5 h-5 text-foreground-secondary group-hover:text-foreground transition-colors" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button className="flex-1 px-4 py-3 bg-accent text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold">
          Save Changes
        </button>
        <button className="flex-1 px-4 py-3 bg-background-secondary border border-border text-foreground rounded-lg hover:bg-background transition-colors font-semibold">
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}
