'use client';

import { AlertTriangle, Users, Zap, TrendingUp } from 'lucide-react';
import { mockSystemStats, mockAlerts, alertTrendData, gasLevelData } from '@/lib/mock-data';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
        <p className="text-foreground-secondary mt-1">Real-time mining safety helmet monitoring</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Helmets Card */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Active Helmets</p>
              <p className="text-3xl font-bold text-foreground mt-2">{mockSystemStats.activeHelmets}</p>
              <p className="text-xs text-foreground-tertiary mt-2">of {mockSystemStats.totalHelmets} total</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        {/* Critical Alerts Card */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Critical Alerts</p>
              <p className="text-3xl font-bold text-critical mt-2">{mockSystemStats.criticalAlerts}</p>
              <p className="text-xs text-foreground-tertiary mt-2">Requiring immediate action</p>
            </div>
            <div className="bg-critical/10 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-critical" />
            </div>
          </div>
        </div>

        {/* Average Gas Level Card */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Avg Gas Level</p>
              <p className="text-3xl font-bold text-foreground mt-2">{mockSystemStats.avgGasLevel.toFixed(1)} ppm</p>
              <p className="text-xs text-foreground-tertiary mt-2">CO concentration</p>
            </div>
            <div className="bg-warning/10 p-3 rounded-lg">
              <Zap className="w-6 h-6 text-warning" />
            </div>
          </div>
        </div>

        {/* Compliance Rate Card */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Compliance Rate</p>
              <p className="text-3xl font-bold text-success mt-2">{mockSystemStats.complianceRate}%</p>
              <p className="text-xs text-foreground-tertiary mt-2">Helmet wearing compliance</p>
            </div>
            <div className="bg-success/10 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alert Trends Chart */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Alert Trends (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={alertTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#f97316" 
                strokeWidth={2}
                dot={{ fill: '#f97316', r: 4 }}
                activeDot={{ r: 6 }}
                name="Alerts"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gas Levels Distribution Chart */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Gas Levels Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gasLevelData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#cbd5e1" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#cbd5e1" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Bar dataKey="value" fill="#0ea5e9" radius={[8, 8, 0, 0]} name="Helmets" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Alerts and System Health Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Critical Alerts Feed Card */}
        <div className="lg:col-span-2 bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Alerts</h3>
          <div className="space-y-3">
            {mockAlerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-4 p-3 bg-background rounded-lg border border-border/50"
              >
                <div
                  className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                    alert.level === 'critical'
                      ? 'bg-critical'
                      : alert.level === 'warning'
                      ? 'bg-warning'
                      : 'bg-info'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground">{alert.workerName}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded font-medium ${
                        alert.level === 'critical'
                          ? 'bg-critical/10 text-critical'
                          : alert.level === 'warning'
                          ? 'bg-warning/10 text-warning'
                          : 'bg-info/10 text-info'
                      }`}
                    >
                      {alert.level.charAt(0).toUpperCase() + alert.level.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground-secondary mt-1">{alert.message}</p>
                  <p className="text-xs text-foreground-tertiary mt-2">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health Card */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">System Health</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-foreground-secondary text-sm">Connected Gateways</p>
                <p className="text-lg font-bold text-foreground">3/3</p>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div className="h-full w-full bg-success"></div>
              </div>
              <p className="text-xs text-success mt-1">Operational</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-foreground-secondary text-sm">Network Latency</p>
                <p className="text-lg font-bold text-foreground">45ms</p>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div className="h-full w-4/5 bg-success"></div>
              </div>
              <p className="text-xs text-success mt-1">Optimal</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-foreground-secondary text-sm">System Uptime</p>
                <p className="text-lg font-bold text-foreground">99.8%</p>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div className="h-full w-full bg-success"></div>
              </div>
              <p className="text-xs text-success mt-1">Excellent</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
