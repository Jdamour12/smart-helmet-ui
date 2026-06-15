'use client';

import { useImpacts, useImpactsWeeklyTrend } from '@/hooks/use-analytics';
import { useHelmetsWithReadings } from '@/hooks/use-helmets';
import type { Helmet } from '@/lib/types';
import { AlertTriangle, Shield, TrendingDown, Heart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ImpactData {
  total_vibration_events?: number;
  fall_alerts?: number;
  helmets_with_impacts?: number;
  avg_per_day?: number;
}

export default function ImpactDetection() {
  const { data: impactRaw, isLoading: impactLoading } = useImpacts();
  const { data: trendRaw }                             = useImpactsWeeklyTrend();
  const { data: helmetsRaw, isLoading: helmLoading }  = useHelmetsWithReadings();

  const impactData = impactRaw as ImpactData | undefined;
  const helmetList = (helmetsRaw as Helmet[] | undefined) ?? [];
  const loading    = impactLoading || helmLoading;

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <p className="text-foreground-secondary">Loading...</p>
      </div>
    );
  }

  const raw = trendRaw as { trend?: { day: string; count: number }[] } | { day: string; count: number }[] | undefined;
  const arr = raw
    ? Array.isArray(raw)
      ? raw
      : (raw as { trend?: { day: string; count: number }[] }).trend ?? []
    : [];
  const weeklyTrend = arr.map((d: { day: string; count: number }) => ({ name: d.day, value: d.count }));

  const helmetsWithImpacts = impactData?.helmets_with_impacts ?? helmetList.filter(h => h.impact_detected).length;
  const totalEvents        = impactData?.total_vibration_events ?? 0;
  const safeHelmets        = helmetList.filter(h => !h.impact_detected).length;
  const avgPerDay          = impactData?.avg_per_day
    ?? (weeklyTrend.length > 0
      ? (weeklyTrend.reduce((s, d) => s + d.value, 0) / weeklyTrend.length).toFixed(1)
      : '0.0');
  const impactedHelmets    = helmetList.filter(h => h.impact_detected);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Impact & Fall Detection</h2>
        <p className="text-foreground-secondary mt-1">Monitor workplace safety incidents and impact events</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Current Impacts</p>
              <p className="text-3xl font-bold text-critical mt-2">{helmetsWithImpacts}</p>
              <p className="text-xs text-foreground-tertiary mt-2">Active detection events</p>
            </div>
            <div className="bg-critical/10 p-3 rounded-lg"><AlertTriangle className="w-6 h-6 text-critical" /></div>
          </div>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Total This Week</p>
              <p className="text-3xl font-bold text-foreground mt-2">{totalEvents}</p>
              <p className="text-xs text-foreground-tertiary mt-2">Recorded incidents</p>
            </div>
            <div className="bg-warning/10 p-3 rounded-lg"><TrendingDown className="w-6 h-6 text-warning" /></div>
          </div>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Safe Status</p>
              <p className="text-3xl font-bold text-success mt-2">{safeHelmets}</p>
              <p className="text-xs text-foreground-tertiary mt-2">No impacts detected</p>
            </div>
            <div className="bg-success/10 p-3 rounded-lg"><Shield className="w-6 h-6 text-success" /></div>
          </div>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Avg Per Day</p>
              <p className="text-3xl font-bold text-foreground mt-2">{avgPerDay}</p>
              <p className="text-xs text-foreground-tertiary mt-2">Average incidents</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg"><Heart className="w-6 h-6 text-primary" /></div>
          </div>
        </div>
      </div>

      <div className="bg-background-secondary border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Impact Events (Weekly Trend)</h3>
        {weeklyTrend.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyTrend}>
              <XAxis dataKey="name" stroke="var(--axis-stroke)" />
              <YAxis stroke="var(--axis-stroke)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--background-secondary)', border: '1px solid var(--border)', borderRadius: '8px' }} labelStyle={{ color: 'var(--foreground)' }} />
              <Legend />
              <Bar dataKey="value" fill="#f97316" radius={[8, 8, 0, 0]} name="Incidents" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-foreground-tertiary text-sm">
            Weekly trend data will appear once IoT readings are available
          </div>
        )}
      </div>

      <div className="bg-background-secondary border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Detected Impacts</h3>
        {impactedHelmets.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-foreground-secondary">No active impact detections</p>
          </div>
        ) : (
          <div className="space-y-3">
            {impactedHelmets.map((h) => (
              <div key={h.id} className="flex items-start gap-4 p-4 bg-background rounded-lg border border-critical/30 bg-critical/5">
                <div className="w-3 h-3 rounded-full bg-critical mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-foreground">{h.worker_name}</p>
                    <span className="text-xs px-2 py-1 rounded bg-critical/10 text-critical font-medium">CRITICAL</span>
                  </div>
                  <p className="text-sm text-foreground-secondary mt-1">Impact detected — immediate response recommended</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-background-secondary border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Safety Recommendations</h3>
        <div className="space-y-3">
          {[
            { icon: '💡', title: 'Ensure Helmets Are Properly Fitted', desc: 'Properly fitted helmets reduce false positives in impact detection' },
            { icon: '⚠️', title: 'Immediate Response Protocol', desc: 'Any detected impact should trigger immediate worker check-in' },
            { icon: '📋', title: 'Incident Documentation', desc: 'Log all detected impacts for safety analysis and reporting' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex gap-4 p-3 bg-background rounded-lg border border-border/50">
              <div className="text-2xl">{icon}</div>
              <div>
                <p className="text-foreground font-medium">{title}</p>
                <p className="text-foreground-secondary text-sm mt-1">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
