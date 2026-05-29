'use client';

import { impactData, mockHelmets } from '@/lib/mock-data';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ImpactDetection() {
  const helmetWithImpacts = mockHelmets.filter(h => h.impactDetected).length;
  const totalImpactsTodayData = impactData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Impact & Fall Detection</h2>
        <p className="text-foreground-secondary mt-1">Monitor workplace safety incidents</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <p className="text-foreground-secondary text-sm">Current Impacts</p>
          <p className="text-3xl font-bold text-critical mt-2">{helmetWithImpacts}</p>
          <p className="text-xs text-foreground-tertiary mt-2">Active detection events</p>
        </div>
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <p className="text-foreground-secondary text-sm">Total Today</p>
          <p className="text-3xl font-bold text-foreground mt-2">{totalImpactsTodayData}</p>
          <p className="text-xs text-foreground-tertiary mt-2">Recorded incidents</p>
        </div>
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <p className="text-foreground-secondary text-sm">Detection Sensitivity</p>
          <p className="text-3xl font-bold text-foreground mt-2">High</p>
          <p className="text-xs text-foreground-tertiary mt-2">Optimal setting</p>
        </div>
      </div>

      {/* Impact Trend Chart */}
      <div className="bg-background-secondary border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Impact Events (Weekly)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={impactData}>
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              labelStyle={{ color: '#0f172a' }}
            />
            <Legend />
            <Bar dataKey="value" fill="#ef4444" radius={[8, 8, 0, 0]} name="Incidents" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Impact Alerts */}
      <div className="bg-background-secondary border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Detected Impacts</h3>
        <div className="space-y-3">
          {mockHelmets.filter(h => h.impactDetected).length > 0 ? (
            mockHelmets.map((helmet) => (
              helmet.impactDetected && (
                <div
                  key={helmet.id}
                  className="flex items-start gap-4 p-4 bg-background rounded-lg border border-critical/30 bg-critical/5"
                >
                  <div className="w-3 h-3 rounded-full bg-critical mt-1.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-foreground">{helmet.workerName}</p>
                      <span className="text-xs px-2 py-1 rounded bg-critical/10 text-critical font-medium">
                        CRITICAL
                      </span>
                    </div>
                    <p className="text-sm text-foreground-secondary mt-1">Impact detected - immediate response recommended</p>
                    <p className="text-xs text-foreground-tertiary mt-2">
                      Last detected: {new Date(helmet.lastUpdate).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              )
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-foreground-secondary">No active impact detections</p>
            </div>
          )}
        </div>
      </div>

      {/* Safety Recommendations */}
      <div className="bg-background-secondary border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Safety Recommendations</h3>
        <div className="space-y-3">
          <div className="flex gap-4 p-3 bg-background rounded-lg border border-border/50">
            <div className="text-2xl">💡</div>
            <div>
              <p className="text-foreground font-medium">Ensure Helmets Are Properly Fitted</p>
              <p className="text-foreground-secondary text-sm mt-1">Properly fitted helmets reduce false positives in impact detection</p>
            </div>
          </div>
          <div className="flex gap-4 p-3 bg-background rounded-lg border border-border/50">
            <div className="text-2xl">⚠️</div>
            <div>
              <p className="text-foreground font-medium">Immediate Response Protocol</p>
              <p className="text-foreground-secondary text-sm mt-1">Any detected impact should trigger immediate worker check-in</p>
            </div>
          </div>
          <div className="flex gap-4 p-3 bg-background rounded-lg border border-border/50">
            <div className="text-2xl">📋</div>
            <div>
              <p className="text-foreground font-medium">Incident Documentation</p>
              <p className="text-foreground-secondary text-sm mt-1">Log all detected impacts for safety analysis and reporting</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
