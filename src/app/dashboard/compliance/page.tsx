"use client";

import { complianceData, mockHelmets } from "@/lib/mock-data";
import { CheckCircle, AlertTriangle, TrendingUp, Target } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ComplianceReports() {
  const helmetWearingCount = mockHelmets.filter((h) => h.helmetWear).length;
  const complianceRate = Math.round(
    (helmetWearingCount / mockHelmets.length) * 100,
  );
  const nonComplianceCount = mockHelmets.filter((h) => !h.helmetWear).length;
  const avgComplianceRate =
    complianceData.reduce((sum, d) => sum + d.value, 0) / complianceData.length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">
          Compliance Reports
        </h2>
        <p className="text-foreground-secondary mt-1">
          Helmet wearing and safety compliance tracking
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Compliance Rate */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">
                Current Rate
              </p>
              <p className="text-3xl font-bold text-success mt-2">
                {complianceRate}%
              </p>
              <p className="text-xs text-foreground-tertiary mt-2">
                {helmetWearingCount} of {mockHelmets.length}
              </p>
            </div>
            <div className="bg-success/10 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
          </div>
        </div>

        {/* Avg Weekly Rate */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">
                Weekly Average
              </p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {avgComplianceRate.toFixed(0)}%
              </p>
              <p className="text-xs text-foreground-tertiary mt-2">
                Target: 95%
              </p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        {/* Non-Compliance Events */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">
                Non-Compliance
              </p>
              <p className="text-3xl font-bold text-warning mt-2">
                {nonComplianceCount}
              </p>
              <p className="text-xs text-foreground-tertiary mt-2">
                This period
              </p>
            </div>
            <div className="bg-warning/10 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-warning" />
            </div>
          </div>
        </div>

        {/* Target Gap */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">
                Target Gap
              </p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {(95 - complianceRate).toFixed(0)}%
              </p>
              <p className="text-xs text-foreground-tertiary mt-2">
                To reach 95% target
              </p>
            </div>
            <div className="bg-critical/10 p-3 rounded-lg">
              <Target className="w-6 h-6 text-critical" />
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Trend */}
      <div className="bg-background-secondary border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Compliance Trend (Weekly)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={complianceData}>
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
            <Line
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: "#10b981", r: 4 }}
              name="Compliance Rate (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Non-Compliant Workers */}
      <div className="bg-background-secondary border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Non-Compliant Workers
        </h3>
        {mockHelmets.filter((h) => !h.helmetWear).length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">
                    Worker
                  </th>
                  <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">
                    Helmet Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockHelmets.map(
                  (helmet) =>
                    !helmet.helmetWear && (
                      <tr
                        key={helmet.id}
                        className="border-b border-border/50 hover:bg-background/50"
                      >
                        <td className="px-4 py-3 text-foreground text-sm font-medium">
                          {helmet.workerName}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-1 rounded font-medium bg-warning/10 text-warning">
                            Not Wearing
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
            All workers are in compliance
          </p>
        )}
      </div>
    </div>
  );
}
