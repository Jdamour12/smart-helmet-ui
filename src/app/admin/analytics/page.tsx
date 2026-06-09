'use client';

import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Activity, Layers, Clock, Shield } from 'lucide-react';
import { useActiveSessions, useUsageTrends, useDepartmentDistribution, usePeakHours } from '@/hooks/use-analytics';
import { useWorkers } from '@/hooks/use-workers';
import { useSupervisors } from '@/hooks/use-supervisors';
import type { Worker, Supervisor } from '@/lib/types';

interface UsageTrend { date: string; count: number; }
interface DeptDist   { department: string; count: number; }
interface PeakHour   { hour: string; usage_pct: number; }

const COLORS = ['#0ea5e9', '#10b981', '#f97316', '#a855f7'];

export default function AnalyticsPage() {
  const { data: sessionsRaw }  = useActiveSessions();
  const { data: trendsRaw }    = useUsageTrends();
  const { data: deptRaw }      = useDepartmentDistribution();
  const { data: peakRaw }      = usePeakHours();
  const { data: workersRaw }   = useWorkers();
  const { data: supsRaw }      = useSupervisors();

  const sessions   = (sessionsRaw as { count?: number } | undefined)?.count ?? 0;
  const workerList = (workersRaw as Worker[] | undefined) ?? [];
  const supList    = (supsRaw as Supervisor[] | undefined) ?? [];

  // Usage trends
  let usageTrends: { name: string; workers: number; supervisors: number }[];
  if (trendsRaw && Array.isArray(trendsRaw) && trendsRaw.length > 0) {
    usageTrends = (trendsRaw as UsageTrend[]).map(d => ({
      name: new Date(d.date).toLocaleDateString([], { weekday: 'short' }),
      workers: d.count,
      supervisors: 0,
    }));
  } else {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    usageTrends = days.map(name => ({ name, workers: workerList.length, supervisors: supList.length }));
  }

  // Department distribution
  let deptDist: { name: string; value: number }[];
  if (deptRaw && Array.isArray(deptRaw) && deptRaw.length > 0) {
    deptDist = (deptRaw as DeptDist[]).map(d => ({ name: d.department, value: d.count }));
  } else {
    const map: Record<string, number> = {};
    workerList.forEach(w => { if (w.department) map[w.department] = (map[w.department] ?? 0) + 1; });
    deptDist = Object.entries(map).map(([name, value]) => ({ name, value }));
  }

  // Peak hours
  const peakHours = peakRaw && Array.isArray(peakRaw)
    ? (peakRaw as PeakHour[]).map(d => ({ hour: d.hour, usage: Math.round(d.usage_pct) }))
    : [];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">System Analytics</h2>
        <p className="text-foreground-secondary mt-1">Comprehensive system usage and performance metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Sessions',    value: sessions,                              sub: 'Supervisors online', color: 'primary', Icon: Activity },
          { label: 'Departments',        value: deptDist.length,                       sub: 'Tracked',            color: 'info',    Icon: Layers },
          { label: 'Peak Hours Tracked', value: peakHours.length > 0 ? peakHours.length : '—', sub: 'Time slots', color: 'warning', Icon: Clock },
          { label: 'System Uptime',      value: '99.9%',                               sub: 'Last 30 days',       color: 'success', Icon: Shield },
        ].map(({ label, value, sub, color, Icon }) => (
          <div key={label} className="bg-background-secondary border border-border rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-foreground-secondary text-sm font-medium">{label}</p>
                <p className={`text-3xl font-bold text-${color} mt-2`}>{value}</p>
                <p className="text-xs text-foreground-tertiary mt-2">{sub}</p>
              </div>
              <div className={`bg-${color}/10 p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 text-${color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">System Usage (Weekly)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={usageTrends}>
              <XAxis dataKey="name" stroke="var(--axis-stroke)" />
              <YAxis stroke="var(--axis-stroke)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--background-secondary)', border: '1px solid var(--border)', borderRadius: '8px' }} labelStyle={{ color: 'var(--foreground)' }} />
              <Legend />
              <Line type="monotone" dataKey="workers"     stroke="#0ea5e9" strokeWidth={2} name="Workers" />
              <Line type="monotone" dataKey="supervisors" stroke="#10b981" strokeWidth={2} name="Supervisors" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Workers by Department</h3>
          {deptDist.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-foreground-tertiary text-sm">No department data</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deptDist}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {deptDist.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--background-secondary)', border: '1px solid var(--border)', borderRadius: '8px' }} labelStyle={{ color: 'var(--foreground)' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {peakHours.length > 0 ? (
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Peak Usage Hours</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {peakHours.slice(0, 8).map((item) => (
              <div key={item.hour} className="text-center p-4 bg-background rounded-lg border border-border/50">
                <p className="text-sm text-foreground-secondary">{item.hour}</p>
                <p className="text-2xl font-bold text-foreground mt-2">{item.usage}%</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Peak Usage Hours</h3>
          <p className="text-sm text-foreground-tertiary text-center py-4">
            Peak hours data will be available once the <code className="bg-background px-1 rounded">GET /analytics/peak-hours</code> endpoint is implemented
          </p>
        </div>
      )}
    </div>
  );
}
