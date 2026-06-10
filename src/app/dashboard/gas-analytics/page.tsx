'use client';

import { useEffect, useState } from 'react';
import { analytics, helmets as helmetsApi } from '@/lib/api';
import type { Helmet } from '@/lib/api';
import { Zap, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface GasData {
  avg_co_ppm: number;
  avg_ch4_pct?: number;
  co_distribution: { safe: number; warning: number; critical: number };
  ch4_distribution: { safe: number; warning: number; critical: number };
}

export default function GasAnalytics() {
  const [gasData, setGasData]     = useState<GasData | null>(null);
  const [helmetList, setHelmets]  = useState<Helmet[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [gas, hlms] = await Promise.all([
          analytics.gasLevels(),
          helmetsApi.list(),
        ]);
        setGasData(gas as GasData);
        setHelmets(hlms as Helmet[]);
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

  const coDist  = gasData?.co_distribution  ?? { safe: 0, warning: 0, critical: 0 };
  const ch4Dist = gasData?.ch4_distribution ?? { safe: 0, warning: 0, critical: 0 };

  const coChartData  = [
    { range: 'Safe (≤50 ppm)',     count: coDist.safe },
    { range: 'Warning (≤200 ppm)', count: coDist.warning },
    { range: 'Critical (>200 ppm)',count: coDist.critical },
  ];
  const ch4ChartData = [
    { range: 'Safe (≤1%)',    count: ch4Dist.safe },
    { range: 'Warning (≤2%)', count: ch4Dist.warning },
    { range: 'Critical (>2%)',count: ch4Dist.critical },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Gas Analytics</h2>
        <p className="text-foreground-secondary mt-1">CO and Methane level analysis across all helmets</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Avg CO Level</p>
              <p className="text-3xl font-bold text-foreground mt-2">{(gasData?.avg_co_ppm ?? 0).toFixed(1)} ppm</p>
              <p className="text-xs text-foreground-tertiary mt-2">Current average</p>
            </div>
            <div className="bg-warning/10 p-3 rounded-lg"><Zap className="w-6 h-6 text-warning" /></div>
          </div>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Avg CH4 Level</p>
              <p className="text-3xl font-bold text-foreground mt-2">{(gasData?.avg_ch4_pct ?? 0).toFixed(2)}%</p>
              <p className="text-xs text-foreground-tertiary mt-2">Current average</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg"><TrendingDown className="w-6 h-6 text-primary" /></div>
          </div>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Safe Status</p>
              <p className="text-3xl font-bold text-success mt-2">{coDist.safe}</p>
              <p className="text-xs text-foreground-tertiary mt-2">Helmets in safe range</p>
            </div>
            <div className="bg-success/10 p-3 rounded-lg"><CheckCircle className="w-6 h-6 text-success" /></div>
          </div>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Warning Status</p>
              <p className="text-3xl font-bold text-warning mt-2">{coDist.warning}</p>
              <p className="text-xs text-foreground-tertiary mt-2">In warning range</p>
            </div>
            <div className="bg-warning/10 p-3 rounded-lg"><AlertTriangle className="w-6 h-6 text-warning" /></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">CO Level Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={coChartData}>
              <XAxis dataKey="range" stroke="var(--axis-stroke)" />
              <YAxis stroke="var(--axis-stroke)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--background-secondary)', border: '1px solid var(--border)', borderRadius: '8px' }} labelStyle={{ color: 'var(--foreground)' }} />
              <Bar dataKey="count" fill="#ef4444" radius={[8, 8, 0, 0]} name="Helmets" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">CH4 Level Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ch4ChartData}>
              <XAxis dataKey="range" stroke="var(--axis-stroke)" />
              <YAxis stroke="var(--axis-stroke)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--background-secondary)', border: '1px solid var(--border)', borderRadius: '8px' }} labelStyle={{ color: 'var(--foreground)' }} />
              <Bar dataKey="count" fill="#f59e0b" radius={[8, 8, 0, 0]} name="Helmets" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-background-secondary border border-border rounded-lg p-6 overflow-x-auto">
        <h3 className="text-lg font-semibold text-foreground mb-4">Gas Levels by Helmet</h3>
        {helmetList.length === 0 ? (
          <p className="text-sm text-foreground-secondary">No helmet data available.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">Worker</th>
                <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">CO Level</th>
                <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">CH4 Level</th>
                <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {helmetList.map((h) => {
                const status = h.co > 200 || h.ch4 > 2
                  ? 'critical'
                  : h.co > 50 || h.ch4 > 1
                    ? 'warning'
                    : 'safe';
                return (
                  <tr key={h.id} className="border-b border-border/50 hover:bg-background/50">
                    <td className="px-4 py-3 text-foreground text-sm">{((h as any).workerName ?? (h as any).worker_name) || '—'}</td>
                    <td className="px-4 py-3 text-foreground text-sm">{(h.co ?? 0).toFixed(1)} ppm</td>
                    <td className="px-4 py-3 text-foreground text-sm">{(h.ch4 ?? 0).toFixed(2)}%</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        status === 'critical' ? 'bg-critical/10 text-critical'
                          : status === 'warning' ? 'bg-warning/10 text-warning'
                            : 'bg-success/10 text-success'
                      }`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
