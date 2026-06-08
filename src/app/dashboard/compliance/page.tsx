'use client';

import { useEffect, useState } from 'react';
import { analytics, helmets as helmetsApi } from '@/lib/api';
import type { Helmet } from '@/lib/api';
import { CheckCircle, AlertTriangle, TrendingUp, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ComplianceData {
  compliance_rate_pct: number;
  helmet_worn_count?: number;
  total_active_helmets?: number;
  non_compliant_count?: number;
}

export default function ComplianceReports() {
  const [comp, setComp]           = useState<ComplianceData | null>(null);
  const [trend, setTrend]         = useState<{ name: string; value: number }[]>([]);
  const [helmetList, setHelmets]  = useState<Helmet[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [c, tr, hlms] = await Promise.all([
          analytics.compliance(),
          analytics.complianceWeeklyTrend().catch(() => null),
          helmetsApi.list(),
        ]);

        setComp(c as ComplianceData);
        setHelmets(hlms as Helmet[]);

        if (tr) {
          const raw = tr as { trend?: { week: string; compliance_rate: number }[] } | { week: string; compliance_rate: number }[];
          const arr = Array.isArray(raw) ? raw : (raw as { trend?: { week: string; compliance_rate: number }[] }).trend ?? [];
          setTrend(arr.map((d: { week: string; compliance_rate: number }) => ({ name: d.week, value: Math.round(d.compliance_rate) })));
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <p className="text-foreground-secondary">Loading...</p>
      </div>
    );
  }

  const complianceRate  = Math.round(comp?.compliance_rate_pct ?? 0);
  const wornCount       = comp?.helmet_worn_count ?? helmetList.filter(h => h.helmet_wear).length;
  const totalCount      = comp?.total_active_helmets ?? helmetList.length;
  const nonCompliant    = comp?.non_compliant_count ?? helmetList.filter(h => !h.helmet_wear).length;
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
        <h3 className="text-lg font-semibold text-foreground mb-4">Non-Compliant Workers</h3>
        {nonCompliantHelmets.length === 0 ? (
          <p className="text-foreground-secondary text-center py-8">All workers are in compliance</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">Worker</th>
                  <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">Helmet Status</th>
                </tr>
              </thead>
              <tbody>
                {nonCompliantHelmets.map((h) => (
                  <tr key={h.id} className="border-b border-border/50 hover:bg-background/50">
                    <td className="px-4 py-3 text-foreground text-sm font-medium">{h.worker_name}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded font-medium bg-warning/10 text-warning">Not Wearing</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
