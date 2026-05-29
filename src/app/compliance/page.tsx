"use client";

import { complianceData, mockHelmets } from "@/lib/mock-data";
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <p className="text-foreground-secondary text-sm">
            Current Compliance Rate
          </p>
          <p className="text-3xl font-bold text-success mt-2">
            {complianceRate}%
          </p>
          <p className="text-xs text-foreground-tertiary mt-2">
            {helmetWearingCount} of {mockHelmets.length} workers
          </p>
        </div>
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <p className="text-foreground-secondary text-sm">Weekly Average</p>
          <p className="text-3xl font-bold text-foreground mt-2">87%</p>
          <p className="text-xs text-foreground-tertiary mt-2">Target: 95%</p>
        </div>
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <p className="text-foreground-secondary text-sm">
            Non-Compliance Events
          </p>
          <p className="text-3xl font-bold text-warning mt-2">
            {mockHelmets.filter((h) => !h.helmetWear).length}
          </p>
          <p className="text-xs text-foreground-tertiary mt-2">This period</p>
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

      {/* Worker Compliance Details */}
      <div className="bg-background-secondary border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Worker Compliance Status
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">
                  Worker
                </th>
                <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">
                  Helmet Worn
                </th>
                <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {mockHelmets.map((helmet) => (
                <tr
                  key={helmet.id}
                  className="border-b border-border/50 hover:bg-background/50"
                >
                  <td className="px-4 py-3 text-foreground text-sm">
                    {helmet.workerName}
                  </td>
                  <td className="px-4 py-3 text-foreground text-sm">
                    {helmet.helmetWear ? "✓ Yes" : "✗ No"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded font-medium ${
                        helmet.helmetWear
                          ? "bg-success/10 text-success"
                          : "bg-critical/10 text-critical"
                      }`}
                    >
                      {helmet.helmetWear ? "Compliant" : "Non-Compliant"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compliance Report Sections */}
      <div className="bg-background-secondary border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Compliance Summary
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-foreground-secondary text-sm mb-2">
              Total Workers Monitored
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-background rounded-full h-2">
                <div className="bg-primary h-full rounded-full w-full"></div>
              </div>
              <span className="text-foreground text-sm font-medium">
                {mockHelmets.length}/6
              </span>
            </div>
          </div>
          <div>
            <p className="text-foreground-secondary text-sm mb-2">
              Helmet Wearing Compliance
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-background rounded-full h-2">
                <div
                  className="bg-success h-full rounded-full"
                  style={{ width: `${complianceRate}%` }}
                ></div>
              </div>
              <span className="text-foreground text-sm font-medium">
                {complianceRate}%
              </span>
            </div>
          </div>
          <div>
            <p className="text-foreground-secondary text-sm mb-2">
              Safety Alert Compliance
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-background rounded-full h-2">
                <div className="bg-primary h-full rounded-full w-3/4"></div>
              </div>
              <span className="text-foreground text-sm font-medium">75%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
