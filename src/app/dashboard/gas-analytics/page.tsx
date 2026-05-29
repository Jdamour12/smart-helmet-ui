'use client';

import { gasLevelData, mockHelmets } from '@/lib/mock-data';
import { Zap, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const coDistribution = [
  { range: '0-10 ppm', count: 3, percentage: 50 },
  { range: '10-20 ppm', count: 2, percentage: 33 },
  { range: '20-40 ppm', count: 0, percentage: 0 },
  { range: '40+ ppm', count: 1, percentage: 17 },
];

const ch4Distribution = [
  { range: '0-0.5%', count: 3, percentage: 50 },
  { range: '0.5-1.0%', count: 2, percentage: 33 },
  { range: '1.0-1.5%', count: 0, percentage: 0 },
  { range: '1.5%+', count: 1, percentage: 17 },
];

export default function GasAnalytics() {
  const avgCO = (mockHelmets.reduce((sum, h) => sum + h.co, 0) / mockHelmets.length).toFixed(1);
  const avgCH4 = (mockHelmets.reduce((sum, h) => sum + h.ch4, 0) / mockHelmets.length).toFixed(2);
  const safeHelmets = mockHelmets.filter(h => h.co <= 20 && h.ch4 <= 0.8).length;
  const warningHelmets = mockHelmets.filter(h => (h.co > 20 && h.co <= 40) || (h.ch4 > 0.8 && h.ch4 <= 1.5)).length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Gas Analytics</h2>
        <p className="text-foreground-secondary mt-1">CO and Methane level analysis across all helmets</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Average CO Level */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Avg CO Level</p>
              <p className="text-3xl font-bold text-foreground mt-2">{avgCO} ppm</p>
              <p className="text-xs text-foreground-tertiary mt-2">Current average</p>
            </div>
            <div className="bg-warning/10 p-3 rounded-lg">
              <Zap className="w-6 h-6 text-warning" />
            </div>
          </div>
        </div>

        {/* Average CH4 Level */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Avg CH4 Level</p>
              <p className="text-3xl font-bold text-foreground mt-2">{avgCH4}%</p>
              <p className="text-xs text-foreground-tertiary mt-2">Current average</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <TrendingDown className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        {/* Safe Status */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Safe Status</p>
              <p className="text-3xl font-bold text-success mt-2">{safeHelmets}</p>
              <p className="text-xs text-foreground-tertiary mt-2">Helmets in safe range</p>
            </div>
            <div className="bg-success/10 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
          </div>
        </div>

        {/* Warning Status */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Warning Status</p>
              <p className="text-3xl font-bold text-warning mt-2">{warningHelmets}</p>
              <p className="text-xs text-foreground-tertiary mt-2">In warning range</p>
            </div>
            <div className="bg-warning/10 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-warning" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CO Distribution */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">CO Level Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={coDistribution}>
              <XAxis dataKey="range" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                labelStyle={{ color: '#0f172a' }}
              />
              <Bar dataKey="count" fill="#ef4444" radius={[8, 8, 0, 0]} name="Helmets" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* CH4 Distribution */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">CH4 Level Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ch4Distribution}>
              <XAxis dataKey="range" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                labelStyle={{ color: '#0f172a' }}
              />
              <Bar dataKey="count" fill="#f59e0b" radius={[8, 8, 0, 0]} name="Helmets" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed List */}
      <div className="bg-background-secondary border border-border rounded-lg p-6 overflow-x-auto">
        <h3 className="text-lg font-semibold text-foreground mb-4">Gas Levels by Helmet</h3>
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
            {mockHelmets.map((helmet) => (
              <tr key={helmet.id} className="border-b border-border/50 hover:bg-background/50">
                <td className="px-4 py-3 text-foreground text-sm">{helmet.workerName}</td>
                <td className="px-4 py-3 text-foreground text-sm">{helmet.co} ppm</td>
                <td className="px-4 py-3 text-foreground text-sm">{helmet.ch4.toFixed(2)}%</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-1 rounded font-medium ${
                      helmet.co > 40 || helmet.ch4 > 1.5
                        ? 'bg-critical/10 text-critical'
                        : helmet.co > 20 || helmet.ch4 > 0.8
                        ? 'bg-warning/10 text-warning'
                        : 'bg-success/10 text-success'
                    }`}
                  >
                    {helmet.co > 40 || helmet.ch4 > 1.5
                      ? 'Critical'
                      : helmet.co > 20 || helmet.ch4 > 0.8
                      ? 'Warning'
                      : 'Safe'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
