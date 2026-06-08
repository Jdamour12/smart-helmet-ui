'use client';

import { useEffect, useState } from 'react';
import { analytics, helmets as helmetsApi } from '@/lib/api';
import type { Helmet } from '@/lib/api';
import { Thermometer, Droplets, Gauge, AlertTriangle } from 'lucide-react';

interface EnvData {
  temperature: { avg: number; max: number; min: number };
  humidity:    { avg: number; max: number; min: number };
}

export default function EnvironmentAnalytics() {
  const [envData, setEnvData]    = useState<EnvData | null>(null);
  const [helmetList, setHelmets] = useState<Helmet[]>([]);
  const [loading, setLoading]    = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [env, hlms] = await Promise.all([
          analytics.environment(),
          helmetsApi.list(),
        ]);
        setEnvData(env as EnvData);
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

  const avgTemp     = envData?.temperature?.avg ?? 0;
  const maxTemp     = envData?.temperature?.max ?? 0;
  const avgHumidity = envData?.humidity?.avg ?? 0;
  const tempWarnings = helmetList.filter(h => h.temperature > 40).length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Temperature & Humidity Analytics</h2>
        <p className="text-foreground-secondary mt-1">Environmental conditions monitoring across mining site</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Avg Temperature</p>
              <p className="text-3xl font-bold text-foreground mt-2">{avgTemp.toFixed(1)}°C</p>
              <p className="text-xs text-foreground-tertiary mt-2">Current average</p>
            </div>
            <div className="bg-warning/10 p-3 rounded-lg"><Thermometer className="w-6 h-6 text-warning" /></div>
          </div>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Avg Humidity</p>
              <p className="text-3xl font-bold text-foreground mt-2">{avgHumidity.toFixed(1)}%</p>
              <p className="text-xs text-foreground-tertiary mt-2">Current average</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg"><Droplets className="w-6 h-6 text-primary" /></div>
          </div>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Max Temperature</p>
              <p className="text-3xl font-bold text-foreground mt-2">{maxTemp.toFixed(1)}°C</p>
              <p className="text-xs text-foreground-tertiary mt-2">Highest reading</p>
            </div>
            <div className="bg-critical/10 p-3 rounded-lg"><Gauge className="w-6 h-6 text-critical" /></div>
          </div>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Temp Warnings</p>
              <p className="text-3xl font-bold text-warning mt-2">{tempWarnings}</p>
              <p className="text-xs text-foreground-tertiary mt-2">Above 40°C threshold</p>
            </div>
            <div className="bg-warning/10 p-3 rounded-lg"><AlertTriangle className="w-6 h-6 text-warning" /></div>
          </div>
        </div>
      </div>

      {/* Summary ranges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Temperature Summary</h3>
          <div className="space-y-4">
            {[
              { label: 'Average', value: `${avgTemp.toFixed(1)}°C`, pct: Math.min((avgTemp / 60) * 100, 100), color: avgTemp > 55 ? 'bg-critical' : avgTemp > 40 ? 'bg-warning' : 'bg-success' },
              { label: 'Maximum', value: `${maxTemp.toFixed(1)}°C`, pct: Math.min((maxTemp / 60) * 100, 100), color: maxTemp > 55 ? 'bg-critical' : maxTemp > 40 ? 'bg-warning' : 'bg-success' },
              { label: 'Minimum', value: `${(envData?.temperature?.min ?? 0).toFixed(1)}°C`, pct: Math.min(((envData?.temperature?.min ?? 0) / 60) * 100, 100), color: 'bg-success' },
            ].map(({ label, value, pct, color }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-foreground-secondary text-sm">{label}</p>
                  <p className="text-sm font-bold text-foreground">{value}</p>
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden">
                  <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Humidity Summary</h3>
          <div className="space-y-4">
            {[
              { label: 'Average', value: `${avgHumidity.toFixed(1)}%`, pct: Math.min(avgHumidity, 100), color: avgHumidity > 75 ? 'bg-critical' : avgHumidity > 60 ? 'bg-warning' : 'bg-success' },
              { label: 'Maximum', value: `${(envData?.humidity?.max ?? 0).toFixed(1)}%`, pct: Math.min(envData?.humidity?.max ?? 0, 100), color: (envData?.humidity?.max ?? 0) > 75 ? 'bg-critical' : (envData?.humidity?.max ?? 0) > 60 ? 'bg-warning' : 'bg-success' },
              { label: 'Minimum', value: `${(envData?.humidity?.min ?? 0).toFixed(1)}%`, pct: Math.min(envData?.humidity?.min ?? 0, 100), color: 'bg-success' },
            ].map(({ label, value, pct, color }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-foreground-secondary text-sm">{label}</p>
                  <p className="text-sm font-bold text-foreground">{value}</p>
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden">
                  <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-background-secondary border border-border rounded-lg p-6 overflow-x-auto">
        <h3 className="text-lg font-semibold text-foreground mb-4">Environmental Data by Worker</h3>
        {helmetList.length === 0 ? (
          <p className="text-sm text-foreground-secondary">No helmet data available.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">Worker</th>
                <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">Temperature</th>
                <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">Humidity</th>
                <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {helmetList.map((h) => {
                const tempStatus = h.temperature > 55 ? 'critical' : h.temperature > 40 ? 'warning' : 'safe';
                const humStatus  = h.humidity > 75 ? 'critical' : h.humidity > 60 ? 'warning' : 'safe';
                const overall    = tempStatus === 'critical' || humStatus === 'critical' ? 'critical'
                  : tempStatus === 'warning' || humStatus === 'warning' ? 'warning' : 'safe';
                return (
                  <tr key={h.id} className="border-b border-border/50 hover:bg-background/50">
                    <td className="px-4 py-3 text-foreground text-sm">{h.worker_name}</td>
                    <td className="px-4 py-3 text-foreground text-sm">{(h.temperature ?? 0).toFixed(1)}°C</td>
                    <td className="px-4 py-3 text-foreground text-sm">{(h.humidity ?? 0).toFixed(1)}%</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        overall === 'critical' ? 'bg-critical/10 text-critical'
                          : overall === 'warning' ? 'bg-warning/10 text-warning'
                            : 'bg-success/10 text-success'
                      }`}>
                        {overall.charAt(0).toUpperCase() + overall.slice(1)}
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
