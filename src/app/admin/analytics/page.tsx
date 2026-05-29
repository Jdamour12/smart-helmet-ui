"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { adminSystemStats } from "@/lib/mock-data";

const systemUsageData = [
  { name: "Mon", helmets: 24, workers: 20, gateways: 3 },
  { name: "Tue", helmets: 25, workers: 22, gateways: 3 },
  { name: "Wed", helmets: 23, workers: 19, gateways: 2 },
  { name: "Thu", helmets: 26, workers: 23, gateways: 3 },
  { name: "Fri", helmets: 28, workers: 25, gateways: 3 },
  { name: "Sat", helmets: 20, workers: 18, gateways: 3 },
  { name: "Sun", helmets: 22, workers: 21, gateways: 3 },
];

const departmentData = [
  { name: "Operations", value: 15 },
  { name: "Maintenance", value: 7 },
  { name: "Safety", value: 3 },
];

const colors = ["#0ea5e9", "#10b981", "#f97316"];

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">System Analytics</h2>
        <p className="text-foreground-secondary mt-1">
          Comprehensive system usage and performance metrics
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <p className="text-foreground-secondary text-sm font-medium">
            Active Sessions
          </p>
          <p className="text-3xl font-bold text-foreground mt-2">
            {adminSystemStats.activeSupervisors}
          </p>
          <p className="text-xs text-success mt-2">Supervisors online</p>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <p className="text-foreground-secondary text-sm font-medium">
            Data Processed
          </p>
          <p className="text-3xl font-bold text-foreground mt-2">12.4 GB</p>
          <p className="text-xs text-success mt-2">Last 24 hours</p>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <p className="text-foreground-secondary text-sm font-medium">
            Avg Response Time
          </p>
          <p className="text-3xl font-bold text-foreground mt-2">45ms</p>
          <p className="text-xs text-success mt-2">Excellent</p>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <p className="text-foreground-secondary text-sm font-medium">
            System Uptime
          </p>
          <p className="text-3xl font-bold text-foreground mt-2">99.98%</p>
          <p className="text-xs text-success mt-2">Last 30 days</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            System Usage (Weekly)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={systemUsageData}>
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
                dataKey="helmets"
                stroke="#0ea5e9"
                strokeWidth={2}
                name="Helmets"
              />
              <Line
                type="monotone"
                dataKey="workers"
                stroke="#10b981"
                strokeWidth={2}
                name="Workers"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Workers by Department
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {departmentData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#0f172a" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity Card */}
      <div className="bg-background-secondary border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Peak Usage Hours
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { hour: "08:00-10:00", usage: 95 },
            { hour: "10:00-12:00", usage: 92 },
            { hour: "13:00-15:00", usage: 88 },
            { hour: "15:00-17:00", usage: 85 },
          ].map((item) => (
            <div
              key={item.hour}
              className="text-center p-4 bg-background rounded-lg border border-border/50"
            >
              <p className="text-sm text-foreground-secondary">{item.hour}</p>
              <p className="text-2xl font-bold text-foreground mt-2">
                {item.usage}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
