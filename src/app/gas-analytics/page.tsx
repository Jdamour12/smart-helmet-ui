'use client';

import { gasLevelData, mockHelmets } from '@/lib/mock-data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

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
  const avgCO = mockHelmets.reduce((sum, h) => sum + h.co, 0) / mockHelmets.length;
  const avgCH4 = mockHelmets.reduce((sum, h) => sum + h.ch4, 0) / mockHelmets.length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Gas Analytics</h2>
        <p className="text-foreground-secondary mt-1">CO and Methane level analysis</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <p className="text-foreground-secondary text-sm">Average CO Level</p>
          <p className="text-3xl font-bold text-foreground mt-2">{avgCO.toFixed(1)} ppm</p>
        </div>
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <p className="text-foreground-secondary text-sm">Average CH4 Level</p>
          <p className="text-3xl font-bold text-foreground mt-2">{avgCH4.toFixed(2)}%</p>
        </div>
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <p className="text-foreground-secondary text-sm">CO Warning Threshold</p>
          <p className="text-3xl font-bold text-warning mt-2">20 ppm</p>
        </div>
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <p className="text-foreground-secondary text-sm">CO Critical Threshold</p>
          <p className="text-3xl font-bold text-critical mt-2">40 ppm</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CO Distribution */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">CO Level Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={coDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="range" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#f1f5f9' }}
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
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="range" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Bar dataKey="count" fill="#f59e0b" radius={[8, 8, 0, 0]} name="Helmets" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed List */}
      <div className="bg-background-secondary border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Gas Levels by Helmet</h3>
        <div className="overflow-x-auto">
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
    </div>
  );
}
