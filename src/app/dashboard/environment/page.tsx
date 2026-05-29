'use client';

import { temperatureData, humidityData, mockHelmets } from '@/lib/mock-data';
import { Thermometer, Droplets, Gauge, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function EnvironmentAnalytics() {
  const avgTemp = (mockHelmets.reduce((sum, h) => sum + h.temperature, 0) / mockHelmets.length).toFixed(1);
  const avgHumidity = (mockHelmets.reduce((sum, h) => sum + h.humidity, 0) / mockHelmets.length).toFixed(1);
  const maxTemp = Math.max(...mockHelmets.map(h => h.temperature));
  const tempWarnings = mockHelmets.filter(h => h.temperature > 30).length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Temperature & Humidity Analytics</h2>
        <p className="text-foreground-secondary mt-1">Environmental conditions monitoring across mining site</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Average Temperature */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Avg Temperature</p>
              <p className="text-3xl font-bold text-foreground mt-2">{avgTemp}°C</p>
              <p className="text-xs text-foreground-tertiary mt-2">Current average</p>
            </div>
            <div className="bg-warning/10 p-3 rounded-lg">
              <Thermometer className="w-6 h-6 text-warning" />
            </div>
          </div>
        </div>

        {/* Average Humidity */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Avg Humidity</p>
              <p className="text-3xl font-bold text-foreground mt-2">{avgHumidity}%</p>
              <p className="text-xs text-foreground-tertiary mt-2">Current average</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <Droplets className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        {/* Maximum Temperature */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Max Temperature</p>
              <p className="text-3xl font-bold text-foreground mt-2">{maxTemp}°C</p>
              <p className="text-xs text-foreground-tertiary mt-2">Highest reading</p>
            </div>
            <div className="bg-critical/10 p-3 rounded-lg">
              <Gauge className="w-6 h-6 text-critical" />
            </div>
          </div>
        </div>

        {/* Temperature Warnings */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Temp Warnings</p>
              <p className="text-3xl font-bold text-warning mt-2">{tempWarnings}</p>
              <p className="text-xs text-foreground-tertiary mt-2">Above 30°C threshold</p>
            </div>
            <div className="bg-warning/10 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-warning" />
            </div>
          </div>
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

      {/* Detailed List */}
      <div className="bg-background-secondary border border-border rounded-lg p-6 overflow-x-auto">
        <h3 className="text-lg font-semibold text-foreground mb-4">Environmental Data by Worker</h3>
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
  );
}
