"use client";

import { impactData, mockHelmets } from "@/lib/mock-data";
import { AlertTriangle, Shield, TrendingDown, Heart } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ImpactDetection() {
  const helmetWithImpacts = mockHelmets.filter((h) => h.impactDetected).length;
  const totalImpactsTodayData = impactData.reduce((sum, d) => sum + d.value, 0);
  const avgIncidentsPerDay = (totalImpactsTodayData / 7).toFixed(1);
  const safeHelmets = mockHelmets.filter((h) => !h.impactDetected).length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">
          Impact & Fall Detection
        </h2>
        <p className="text-foreground-secondary mt-1">
          Monitor workplace safety incidents and impact events
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Impacts */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">
                Current Impacts
              </p>
              <p className="text-3xl font-bold text-critical mt-2">
                {helmetWithImpacts}
              </p>
              <p className="text-xs text-foreground-tertiary mt-2">
                Active detection events
              </p>
            </div>
            <div className="bg-critical/10 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-critical" />
            </div>
          </div>
        </div>

        {/* Total This Week */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">
                Total This Week
              </p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {totalImpactsTodayData}
              </p>
              <p className="text-xs text-foreground-tertiary mt-2">
                Recorded incidents
              </p>
            </div>
            <div className="bg-warning/10 p-3 rounded-lg">
              <TrendingDown className="w-6 h-6 text-warning" />
            </div>
          </div>
        </div>

        {/* Safe Helmets */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">
                Safe Status
              </p>
              <p className="text-3xl font-bold text-success mt-2">
                {safeHelmets}
              </p>
              <p className="text-xs text-foreground-tertiary mt-2">
                No impacts detected
              </p>
            </div>
            <div className="bg-success/10 p-3 rounded-lg">
              <Shield className="w-6 h-6 text-success" />
            </div>
          </div>
        </div>

        {/* Avg Per Day */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">
                Avg Per Day
              </p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {avgIncidentsPerDay}
              </p>
              <p className="text-xs text-foreground-tertiary mt-2">
                Average incidents
              </p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <Heart className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Impact Trend Chart */}
      <div className="bg-background-secondary border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Impact Events (Weekly Trend)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={impactData}>
            <XAxis dataKey="name" stroke="var(--axis-stroke)" />
            <YAxis stroke="var(--axis-stroke)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--background-secondary)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "var(--foreground)" }}
            />
            <Legend />
            <Bar
              dataKey="value"
              fill="#f97316"
              radius={[8, 8, 0, 0]}
              name="Incidents"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Impact Alerts */}
      <div className="bg-background-secondary border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Detected Impacts
        </h3>
        {mockHelmets.filter((h) => h.impactDetected).length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">
                    Worker
                  </th>
                  <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">
                    Impact Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockHelmets.map(
                  (helmet) =>
                    helmet.impactDetected && (
                      <tr
                        key={helmet.id}
                        className="border-b border-border/50 hover:bg-background/50"
                      >
                        <td className="px-4 py-3 text-foreground text-sm font-medium">
                          {helmet.workerName}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-1 rounded font-medium bg-critical/10 text-critical">
                            Impact Detected
                          </span>
                        </td>
                      </tr>
                    ),
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-foreground-secondary text-center py-8">
            No impacts currently detected
          </p>
        )}
      </div>
    </div>
  );
}
