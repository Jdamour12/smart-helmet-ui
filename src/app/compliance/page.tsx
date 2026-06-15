'use client';

import { useCompliance, useComplianceWeeklyTrend } from '@/hooks/use-analytics';
import { useHelmetsWithReadings } from '@/hooks/use-helmets';
import type { Helmet } from '@/lib/types';
import { CheckCircle, AlertTriangle, TrendingUp, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ComplianceData {
  compliance_rate_pct: number;
  helmet_worn?: number;
  total_readings?: number;
}

export default function ComplianceReports() {
  const { data: compRaw, isLoading: compLoading }    = useCompliance();
  const { data: trendRaw }                            = useComplianceWeeklyTrend();
  const { data: helmetsRaw, isLoading: helmLoading }  = useHelmetsWithReadings();

  const comp       = compRaw as ComplianceData | undefined;
  const helmetList = (helmetsRaw as Helmet[] | undefined) ?? [];
  const loading    = compLoading || helmLoading;

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <p className="text-foreground-secondary">Loading...</p>
      </div>
    );
  }

  const raw = trendRaw as { trend?: { week: string; compliance_rate: number }[] } | { week: string; compliance_rate: number }[] | undefined;
  const arr = raw
    ? Array.isArray(raw)
      ? raw
      : (raw as { trend?: { week: string; compliance_rate: number }[] }).trend ?? []
    : [];
  const trend = arr.map((d: { week: string; compliance_rate: number }) => ({ name: d.week, value: Math.round(d.compliance_rate) }));

  const complianceRate  = Math.round(comp?.compliance_rate_pct ?? 0);
  const wornCount       = comp?.helmet_worn ?? helmetList.filter(h => h.helmet_wear).length;
  const totalCount      = comp?.total_readings ?? helmetList.length;
  const nonCompliant    = Math.max(0, totalCount - wornCount);
  const avgTrend        = trend.length > 0 ? Math.round(trend.reduce((s, d) => s + d.value, 0) / trend.length) : complianceRate;
  const targetGap       = Math.max(0, 95 - complianceRate);
  const nonCompliantHelmets = helmetList.filter(h => !h.helmet_wear);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Compliance Reports</h2>
        <p className="text-foreground-secondary mt-1">Helmet wearing and safety compliance tracking</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Current Rate</p>
              <p className="text-3xl font-bold text-success mt-2">{complianceRate}%</p>
              <p className="text-xs text-foreground-tertiary mt-2">{wornCount} of {totalCount}</p>
            </div>
            <div className="bg-success/10 p-3 rounded-lg"><CheckCircle className="w-6 h-6 text-success" /></div>
          </div>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Weekly Average</p>
              <p className="text-3xl font-bold text-foreground mt-2">{avgTrend}%</p>
              <p className="text-xs text-foreground-tertiary mt-2">Target: 95%</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg"><TrendingUp className="w-6 h-6 text-primary" /></div>
          </div>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Non-Compliance</p>
              <p className="text-3xl font-bold text-warning mt-2">{nonCompliant}</p>
              <p className="text-xs text-foreground-tertiary mt-2">This period</p>
            </div>
            <div className="bg-warning/10 p-3 rounded-lg"><AlertTriangle className="w-6 h-6 text-warning" /></div>
          </div>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Target Gap</p>
              <p className="text-3xl font-bold text-foreground mt-2">{targetGap}%</p>
              <p className="text-xs text-foreground-tertiary mt-2">To reach 95% target</p>
            </div>
            <div className="bg-critical/10 p-3 rounded-lg"><Target className="w-6 h-6 text-critical" /></div>
          </div>
        </div>
      </div>

      <div className="bg-background-secondary border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Compliance Trend (Weekly)</h3>
        {trend.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trend}>
              <XAxis dataKey="name" stroke="var(--axis-stroke)" />
              <YAxis stroke="var(--axis-stroke)" domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--background-secondary)', border: '1px solid var(--border)', borderRadius: '8px' }} labelStyle={{ color: 'var(--foreground)' }} />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} name="Compliance Rate (%)" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-foreground-tertiary text-sm">
            Weekly trend data will appear once IoT readings are available
          </div>
        )}
      </div>

      <div className="bg-background-secondary border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Worker Compliance Status</h3>
        {helmetList.length === 0 ? (
          <p className="text-foreground-secondary text-center py-8">No helmet data available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">Worker</th>
                  <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">Helmet Worn</th>
                  <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {helmetList.map((h) => (
                  <tr key={h.id} className="border-b border-border/50 hover:bg-background/50">
                    <td className="px-4 py-3 text-foreground text-sm">{h.worker_name}</td>
                    <td className="px-4 py-3 text-foreground text-sm">{h.helmet_wear ? '✓ Yes' : '✗ No'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded font-medium ${h.helmet_wear ? 'bg-success/10 text-success' : 'bg-critical/10 text-critical'}`}>
                        {h.helmet_wear ? 'Compliant' : 'Non-Compliant'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-background-secondary border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Compliance Summary</h3>
        <div className="space-y-4">
          <div>
            <p className="text-foreground-secondary text-sm mb-2">Total Workers Monitored</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-background rounded-full h-2">
                <div className="bg-primary h-full rounded-full w-full" />
              </div>
              <span className="text-foreground text-sm font-medium">{totalCount}</span>
            </div>
          </div>
          <div>
            <p className="text-foreground-secondary text-sm mb-2">Helmet Wearing Compliance</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-background rounded-full h-2">
                <div className="bg-success h-full rounded-full" style={{ width: `${complianceRate}%` }} />
              </div>
              <span className="text-foreground text-sm font-medium">{complianceRate}%</span>
            </div>
          </div>
          <div>
            <p className="text-foreground-secondary text-sm mb-2">Non-Compliant Workers</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-background rounded-full h-2">
                <div
                  className="bg-critical h-full rounded-full"
                  style={{ width: totalCount > 0 ? `${(nonCompliant / totalCount) * 100}%` : '0%' }}
                />
              </div>
              <span className="text-foreground text-sm font-medium">{nonCompliantHelmets.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
