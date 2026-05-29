'use client';

import { temperatureData, humidityData, mockHelmets } from '@/lib/mock-data';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const tempThresholds = [
  { label: 'Safe (< 30°C)', min: 0, max: 30, color: 'success' },
  { label: 'Warning (30-35°C)', min: 30, max: 35, color: 'warning' },
  { label: 'Critical (> 35°C)', min: 35, max: 100, color: 'critical' },
];

const humidityThresholds = [
  { label: 'Safe (< 60%)', min: 0, max: 60, color: 'success' },
  { label: 'Warning (60-75%)', min: 60, max: 75, color: 'warning' },
  { label: 'Critical (> 75%)', min: 75, max: 100, color: 'critical' },
];

export default function EnvironmentAnalytics() {
  const avgTemp = mockHelmets.reduce((sum, h) => sum + h.temperature, 0) / mockHelmets.length;
  const avgHumidity = mockHelmets.reduce((sum, h) => sum + h.humidity, 0) / mockHelmets.length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Temperature & Humidity Analytics</h2>
        <p className="text-foreground-secondary mt-1">Environmental conditions monitoring</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <p className="text-foreground-secondary text-sm">Average Temperature</p>
          <p className="text-3xl font-bold text-foreground mt-2">{avgTemp.toFixed(1)}°C</p>
          <p className="text-xs text-foreground-tertiary mt-2">Current conditions</p>
        </div>
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <p className="text-foreground-secondary text-sm">Average Humidity</p>
          <p className="text-3xl font-bold text-foreground mt-2">{avgHumidity.toFixed(1)}%</p>
          <p className="text-xs text-foreground-tertiary mt-2">Current conditions</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature Trend */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Temperature Trend (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={temperatureData}>
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                labelStyle={{ color: '#0f172a' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#f59e0b" 
                strokeWidth={2}
                dot={{ fill: '#f59e0b', r: 4 }}
                name="Temp (°C)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Humidity Trend */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Humidity Trend (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={humidityData}>
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                labelStyle={{ color: '#0f172a' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#0ea5e9" 
                strokeWidth={2}
                dot={{ fill: '#0ea5e9', r: 4 }}
                name="Humidity (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Thresholds */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Temperature Thresholds</h3>
          <div className="space-y-3">
            {tempThresholds.map((t) => (
              <div key={t.label} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded ${
                  t.color === 'success' ? 'bg-success' : t.color === 'warning' ? 'bg-warning' : 'bg-critical'
                }`} />
                <span className="text-foreground text-sm">{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Humidity Thresholds</h3>
          <div className="space-y-3">
            {humidityThresholds.map((h) => (
              <div key={h.label} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded ${
                  h.color === 'success' ? 'bg-success' : h.color === 'warning' ? 'bg-warning' : 'bg-critical'
                }`} />
                <span className="text-foreground text-sm">{h.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed List */}
      <div className="bg-background-secondary border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Environmental Data by Worker</h3>
        <div className="overflow-x-auto">
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
              {mockHelmets.map((helmet) => {
                const tempStatus = helmet.temperature > 35 ? 'critical' : helmet.temperature >= 30 ? 'warning' : 'success';
                const humStatus = helmet.humidity > 75 ? 'critical' : helmet.humidity >= 60 ? 'warning' : 'success';
                const overallStatus = tempStatus === 'critical' || humStatus === 'critical' ? 'critical' : tempStatus === 'warning' || humStatus === 'warning' ? 'warning' : 'success';

                return (
                  <tr key={helmet.id} className="border-b border-border/50 hover:bg-background/50">
                    <td className="px-4 py-3 text-foreground text-sm">{helmet.workerName}</td>
                    <td className="px-4 py-3 text-foreground text-sm">{helmet.temperature}°C</td>
                    <td className="px-4 py-3 text-foreground text-sm">{helmet.humidity}%</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded font-medium ${
                          overallStatus === 'critical'
                            ? 'bg-critical/10 text-critical'
                            : overallStatus === 'warning'
                            ? 'bg-warning/10 text-warning'
                            : 'bg-success/10 text-success'
                        }`}
                      >
                        {overallStatus.charAt(0).toUpperCase() + overallStatus.slice(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
