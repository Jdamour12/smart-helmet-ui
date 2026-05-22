'use client';

import { Edit2, Trash2, Eye, Settings } from 'lucide-react';
import { mockAlerts, adminSystemStats } from '@/lib/mock-data';

export default function AlertsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Manage Alerts</h2>
          <p className="text-foreground-secondary mt-1">Monitor and configure system alerts</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Total Alerts Today</p>
              <p className="text-3xl font-bold text-foreground mt-2">{adminSystemStats.alertsToday}</p>
              <p className="text-xs text-foreground-tertiary mt-2">24-hour period</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-primary">{adminSystemStats.alertsToday}</span>
            </div>
          </div>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Critical Alerts</p>
              <p className="text-3xl font-bold text-critical mt-2">{adminSystemStats.criticalAlerts}</p>
              <p className="text-xs text-critical mt-2">Require action</p>
            </div>
            <div className="w-12 h-12 bg-critical/10 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-critical">{adminSystemStats.criticalAlerts}</span>
            </div>
          </div>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Warning Alerts</p>
              <p className="text-3xl font-bold text-warning mt-2">
                {adminSystemStats.alertsToday - adminSystemStats.criticalAlerts}
              </p>
              <p className="text-xs text-foreground-tertiary mt-2">Today</p>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-warning">
                {adminSystemStats.alertsToday - adminSystemStats.criticalAlerts}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Resolution Rate</p>
              <p className="text-3xl font-bold text-success mt-2">87%</p>
              <p className="text-xs text-foreground-tertiary mt-2">This month</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-success">87%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-background-secondary border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Alerts</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">Type</th>
                <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">Target</th>
                <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">Worker</th>
                <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">Message</th>
                <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">Level</th>
                <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">Timestamp</th>
                <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockAlerts.map((alert) => (
                <tr key={alert.id} className="border-b border-border/50 hover:bg-background transition-colors">
                  <td className="py-3 px-4 text-foreground font-medium text-sm">{alert.type}</td>
                  <td className="py-3 px-4 text-foreground-secondary text-sm">{alert.helmetId}</td>
                  <td className="py-3 px-4 text-foreground-secondary text-sm">{alert.workerName}</td>
                  <td className="py-3 px-4 text-foreground-secondary text-sm truncate max-w-xs">{alert.message}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        alert.level === 'critical'
                          ? 'bg-critical/10 text-critical'
                          : alert.level === 'warning'
                          ? 'bg-warning/10 text-warning'
                          : 'bg-info/10 text-info'
                      }`}
                    >
                      {alert.level.charAt(0).toUpperCase() + alert.level.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-foreground-secondary text-sm">
                    {new Date(alert.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-background rounded transition-colors" title="View">
                        <Eye className="w-4 h-4 text-info" />
                      </button>
                      <button className="p-2 hover:bg-background rounded transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4 text-primary" />
                      </button>
                      <button className="p-2 hover:bg-background rounded transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4 text-critical" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alert Configuration */}
      <div className="bg-background-secondary border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Alert Configuration</h3>
          <button className="text-primary hover:text-primary-dark flex items-center gap-2 transition-colors">
            <Settings className="w-5 h-5" />
            Configure
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border/50">
            <div>
              <p className="text-foreground font-medium">Critical Alerts</p>
              <p className="text-sm text-foreground-secondary">Immediate notification for critical issues</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border/50">
            <div>
              <p className="text-foreground font-medium">Warning Alerts</p>
              <p className="text-sm text-foreground-secondary">Notification for warning level events</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border/50">
            <div>
              <p className="text-foreground font-medium">Email Notifications</p>
              <p className="text-sm text-foreground-secondary">Send alerts via email</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
