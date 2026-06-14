'use client';

import { AlertTriangle, Users, Zap, TrendingUp, ShieldAlert } from 'lucide-react';
import { useAnalyticsSummary, useGasLevels, useCompliance, useAlertsByLevel, useAlertTrends, useNetworkHealth } from '@/hooks/use-analytics';
import { useAlertFeed } from '@/hooks/use-alerts';
import type { Alert } from '@/lib/types';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { data: summary } = useAnalyticsSummary();
  const { data: gas }     = useGasLevels();
  const { data: comp }    = useCompliance();
  const { data: byLevel } = useAlertsByLevel();
  const { data: trends }  = useAlertTrends(1);
  const { data: feed }    = useAlertFeed();
  const { data: network } = useNetworkHealth();

  const s  = summary as { total_helmets?: number; total_workers?: number; unresolved_alerts?: number } | undefined;
  const g  = gas as { avg_co_ppm?: number; co_distribution?: { safe: number; warning: number; critical: number }; ch4_distribution?: { safe: number; warning: number; critical: number } } | undefined;
  const c  = comp as { compliance_rate_pct?: number } | undefined;
  const lv = byLevel as { level: string; count: number }[] | undefined;
  const tr = trends  as { date: string; count: number }[] | undefined;
  const nw = network as { total_gateways?: number; online?: number; avg_packet_delivery_rate?: number } | undefined;

  const totalHelmets    = s?.total_helmets ?? 0;
  const criticalAlerts  = lv?.find(l => l.level === 'critical')?.count ?? 0;
  const avgGasLevel     = g?.avg_co_ppm ?? 0;
  const complianceRate  = Math.round(c?.compliance_rate_pct ?? 0);
  const recentAlerts    = (feed as Alert[] | undefined) ?? [];
  const aiDangerCount   = recentAlerts.filter(a => a.type === 'multi' && (new Date(a.timestamp).getTime() > (Date.now() - 24 * 60 * 60 * 1000))).length;

  const alertTrends = (tr ?? []).map(d => ({
    name: new Date(d.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    value: d.count,
  }));

  const gasDistribution = [
    { name: 'CO Safe',      value: g?.co_distribution?.safe ?? 0 },
    { name: 'CO Warning',   value: g?.co_distribution?.warning ?? 0 },
    { name: 'CO Critical',  value: g?.co_distribution?.critical ?? 0 },
    { name: 'CH4 Safe',     value: g?.ch4_distribution?.safe ?? 0 },
    { name: 'CH4 Warning',  value: g?.ch4_distribution?.warning ?? 0 },
    { name: 'CH4 Critical', value: g?.ch4_distribution?.critical ?? 0 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
        <p className="text-foreground-secondary mt-1">Real-time mining safety helmet monitoring</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Total Helmets</p>
              <p className="text-3xl font-bold text-foreground mt-2">{totalHelmets}</p>
              <p className="text-xs text-foreground-tertiary mt-2">Registered helmets</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg"><Users className="w-6 h-6 text-primary" /></div>
          </div>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Critical Alerts</p>
              <p className="text-3xl font-bold text-critical mt-2">{criticalAlerts}</p>
              <p className="text-xs text-foreground-tertiary mt-2">Requiring immediate action</p>
            </div>
            <div className="bg-critical/10 p-3 rounded-lg"><AlertTriangle className="w-6 h-6 text-critical" /></div>
          </div>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">AI Danger Detections</p>
              <p className="text-3xl font-bold text-critical mt-2">{aiDangerCount}</p>
              <p className="text-xs text-foreground-tertiary mt-2">Last 24 hours</p>
            </div>
            <div className="bg-critical/10 p-3 rounded-lg"><ShieldAlert className="w-6 h-6 text-critical" /></div>
          </div>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Compliance Rate</p>
              <p className="text-3xl font-bold text-success mt-2">{complianceRate}%</p>
              <p className="text-xs text-foreground-tertiary mt-2">Helmet wearing compliance</p>
            </div>
            <div className="bg-success/10 p-3 rounded-lg"><TrendingUp className="w-6 h-6 text-success" /></div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Alert Trends (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={alertTrends}>
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }} labelStyle={{ color: '#0f172a' }} />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316', r: 4 }} activeDot={{ r: 6 }} name="Alerts" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Gas Levels Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gasDistribution}>
              <XAxis dataKey="name" stroke="#94a3b8" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }} labelStyle={{ color: '#0f172a' }} />
              <Bar dataKey="value" fill="#0ea5e9" radius={[8, 8, 0, 0]} name="Helmets" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Alerts + System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Alerts</h3>
          <div className="space-y-3">
            {recentAlerts.length === 0 && <p className="text-sm text-foreground-secondary">No recent alerts.</p>}
            {recentAlerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className="flex items-start gap-4 p-3 bg-background rounded-lg border border-border/50">
                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${alert.level === 'critical' ? 'bg-critical' : alert.level === 'warning' ? 'bg-warning' : 'bg-info'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground">{alert.type} alert</p>
                    <span className={`text-xs px-2 py-1 rounded font-medium ${alert.level === 'critical' ? 'bg-critical/10 text-critical' : alert.level === 'warning' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info'}`}>
                      {(alert.level ?? 'info').charAt(0).toUpperCase() + (alert.level ?? 'info').slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground-secondary mt-1">{alert.message}</p>
                  <p className="text-xs text-foreground-tertiary mt-2">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">System Health</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-foreground-secondary text-sm">Connected Gateways</p>
                <p className="text-lg font-bold text-foreground">{nw?.online ?? 0}/{nw?.total_gateways ?? 0}</p>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div className="h-full bg-success" style={{ width: nw?.total_gateways ? `${((nw.online ?? 0) / nw.total_gateways) * 100}%` : '0%' }} />
              </div>
              <p className="text-xs text-success mt-1">Operational</p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-foreground-secondary text-sm">Packet Delivery</p>
                <p className="text-lg font-bold text-foreground">{((nw?.avg_packet_delivery_rate ?? 0) * 100).toFixed(1)}%</p>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div className="h-full bg-success" style={{ width: `${(nw?.avg_packet_delivery_rate ?? 0) * 100}%` }} />
              </div>
              <p className="text-xs text-success mt-1">Optimal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
