'use client';

import { Users, UserCheck, Wifi, AlertTriangle } from 'lucide-react';
import { adminSystemStats, mockSupervisors, mockAuditLogs } from '@/lib/mock-data';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const systemHealthData = [
  { name: '00:00', value: 94 },
  { name: '04:00', value: 95 },
  { name: '08:00', value: 93 },
  { name: '12:00', value: 96 },
  { name: '16:00', value: 95 },
  { name: '20:00', value: 97 },
  { name: '24:00', value: 96 },
];

const userDistribution = [
  { name: 'Active', value: adminSystemStats.activeSupervisors },
  { name: 'Inactive', value: adminSystemStats.totalSupervisors - adminSystemStats.activeSupervisors },
];

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">System Overview</h2>
        <p className="text-foreground-secondary mt-1">Admin dashboard - Manage all system operations</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Total Supervisors</p>
              <p className="text-3xl font-bold text-foreground mt-2">{adminSystemStats.totalSupervisors}</p>
              <p className="text-xs text-success mt-2">{adminSystemStats.activeSupervisors} active</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Total Workers</p>
              <p className="text-3xl font-bold text-foreground mt-2">{adminSystemStats.totalWorkers}</p>
              <p className="text-xs text-success mt-2">{adminSystemStats.activeWorkers} active</p>
            </div>
            <div className="bg-success/10 p-3 rounded-lg">
              <UserCheck className="w-6 h-6 text-success" />
            </div>
          </div>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Gateway Status</p>
              <p className="text-3xl font-bold text-foreground mt-2">{adminSystemStats.onlineGateways}/{adminSystemStats.totalGateways}</p>
              <p className="text-xs text-warning mt-2">Online</p>
            </div>
            <div className="bg-warning/10 p-3 rounded-lg">
              <Wifi className="w-6 h-6 text-warning" />
            </div>
          </div>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Alerts Today</p>
              <p className="text-3xl font-bold text-critical mt-2">{adminSystemStats.alertsToday}</p>
              <p className="text-xs text-critical mt-2">{adminSystemStats.criticalAlerts} critical</p>
            </div>
            <div className="bg-critical/10 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-critical" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">System Health (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={systemHealthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" domain={[85, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
                name="Health %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Supervisor Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Bar dataKey="value" fill="#0ea5e9" radius={[8, 8, 0, 0]} name="Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity and Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {mockAuditLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-4 p-3 bg-background rounded-lg border border-border/50"
              >
                <div
                  className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                    log.severity === 'critical'
                      ? 'bg-critical'
                      : log.severity === 'warning'
                      ? 'bg-warning'
                      : 'bg-info'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground">{log.action}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded font-medium ${
                        log.severity === 'critical'
                          ? 'bg-critical/10 text-critical'
                          : log.severity === 'warning'
                          ? 'bg-warning/10 text-warning'
                          : 'bg-info/10 text-info'
                      }`}
                    >
                      {log.severity.charAt(0).toUpperCase() + log.severity.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground-secondary mt-1">{log.details}</p>
                  <p className="text-xs text-foreground-tertiary mt-2">
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Performance Card */}
        <div className="bg-background-secondary border border-border rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">System Performance</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-foreground-secondary text-sm">Average Response Time</p>
                <p className="text-lg font-bold text-primary">145ms</p>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div className="h-full bg-success" style={{width: '92%'}}></div>
              </div>
              <p className="text-xs text-success mt-1">Excellent</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-foreground-secondary text-sm">CPU Usage</p>
                <p className="text-lg font-bold text-warning">68%</p>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div className="h-full bg-warning" style={{width: '68%'}}></div>
              </div>
              <p className="text-xs text-foreground-tertiary mt-1">Normal</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-foreground-secondary text-sm">Memory Usage</p>
                <p className="text-lg font-bold text-info">54%</p>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div className="h-full bg-info" style={{width: '54%'}}></div>
              </div>
              <p className="text-xs text-success mt-1">Good</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-foreground-secondary text-sm">API Availability</p>
                <p className="text-lg font-bold text-success">99.9%</p>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div className="h-full w-full bg-success"></div>
              </div>
              <p className="text-xs text-success mt-1">Perfect</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
