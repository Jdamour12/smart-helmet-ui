"use client";

import Link from "next/link";
import { Users, UserCheck, HardHat, AlertTriangle, Building2, ChevronRight } from "lucide-react";
import { useSupervisors } from "@/hooks/use-supervisors";
import { useWorkers } from "@/hooks/use-workers";
import { useHelmets } from "@/hooks/use-helmets";
import { useAlertsByLevel, useSystemHealthTrends } from "@/hooks/use-analytics";
import { useAuditLogs } from "@/hooks/use-reports";
import type { Supervisor, Worker, Helmet } from "@/lib/types";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface AuditLog { id: string; event: string; detail: string; status: string; timestamp: string; }
interface HealthTrend { timestamp: string; cpu: number; memory: number; disk: number; }

export default function AdminDashboard() {
  const { data: supsRaw }    = useSupervisors();
  const { data: workersRaw } = useWorkers();
  const { data: helmetsRaw } = useHelmets();
  const { data: byLevelRaw } = useAlertsByLevel();
  const { data: auditRaw }   = useAuditLogs({ limit: '5' });
  const { data: healthRaw }  = useSystemHealthTrends();

  const supList     = (supsRaw    as Supervisor[] | undefined) ?? [];
  const workerList  = (workersRaw as Worker[]     | undefined) ?? [];
  const helmetList  = (helmetsRaw as Helmet[]     | undefined) ?? [];
  const lv          = (byLevelRaw as { level: string; count: number }[] | undefined) ?? [];
  const auditData   = auditRaw as { logs?: AuditLog[] } | AuditLog[] | undefined;
  const auditLogs   = (Array.isArray(auditData)
    ? auditData
    : (auditData as { logs?: AuditLog[] } | undefined)?.logs ?? []
  ).slice(0, 3);
  const healthTrends = ((healthRaw as HealthTrend[] | undefined) ?? []).map((h) => ({
    name: new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    cpu: h.cpu,
    memory: h.memory,
    disk: h.disk,
  }));

  const criticalCount = lv.find(x => x.level === 'critical')?.count ?? 0;
  const alertsToday   = lv.reduce((acc, x) => acc + x.count, 0);
  const activeWorkers = workerList.filter(w => w.status === 'active').length;
  const activeSups    = supList.filter(s => s.status === 'active').length;
  const activeHelmets = helmetList.filter(h => h.status === 'active').length;

  const supervisorDist = [
    { name: 'Active',   value: activeSups },
    { name: 'Inactive', value: supList.length - activeSups },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">System Overview</h2>
        <p className="text-foreground-secondary mt-1">Admin dashboard - Manage all system operations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Total Supervisors</p>
              <p className="text-3xl font-bold text-foreground mt-2">{supList.length}</p>
              <p className="text-xs text-success mt-2">{activeSups} active</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg"><Users className="w-6 h-6 text-primary" /></div>
          </div>
        </div>
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Total Workers</p>
              <p className="text-3xl font-bold text-foreground mt-2">{workerList.length}</p>
              <p className="text-xs text-success mt-2">{activeWorkers} active</p>
            </div>
            <div className="bg-success/10 p-3 rounded-lg"><UserCheck className="w-6 h-6 text-success" /></div>
          </div>
        </div>
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Total Helmets</p>
              <p className="text-3xl font-bold text-foreground mt-2">{helmetList.length}</p>
              <p className="text-xs text-warning mt-2">{activeHelmets} active</p>
            </div>
            <div className="bg-warning/10 p-3 rounded-lg"><HardHat className="w-6 h-6 text-warning" /></div>
          </div>
        </div>
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Total Alerts</p>
              <p className="text-3xl font-bold text-critical mt-2">{alertsToday}</p>
              <p className="text-xs text-critical mt-2">{criticalCount} critical</p>
            </div>
            <div className="bg-critical/10 p-3 rounded-lg"><AlertTriangle className="w-6 h-6 text-critical" /></div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">System Health (24h)</h3>
          {healthTrends.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={healthTrends}>
                <XAxis dataKey="name" stroke="var(--axis-stroke)" />
                <YAxis stroke="var(--axis-stroke)" domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: "var(--background-secondary)", border: "1px solid var(--border)", borderRadius: "8px" }} labelStyle={{ color: "var(--foreground)" }} />
                <Legend />
                <Line type="monotone" dataKey="cpu"    stroke="#f97316" strokeWidth={2} name="CPU %"    dot={false} />
                <Line type="monotone" dataKey="memory" stroke="#0ea5e9" strokeWidth={2} name="Memory %" dot={false} />
                <Line type="monotone" dataKey="disk"   stroke="#10b981" strokeWidth={2} name="Disk %"   dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-foreground-tertiary text-sm">
              Health trend data will appear after system performance is sampled
            </div>
          )}
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Supervisor Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={supervisorDist}>
              <XAxis dataKey="name" stroke="var(--axis-stroke)" />
              <YAxis stroke="var(--axis-stroke)" />
              <Tooltip contentStyle={{ backgroundColor: "var(--background-secondary)", border: "1px solid var(--border)", borderRadius: "8px" }} labelStyle={{ color: "var(--foreground)" }} />
              <Bar dataKey="value" fill="#0ea5e9" radius={[8, 8, 0, 0]} name="Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {auditLogs.length === 0 && <p className="text-sm text-foreground-secondary">No activity yet.</p>}
            {(auditLogs as AuditLog[]).map((log) => (
              <div key={log.id} className="flex items-start gap-4 p-3 bg-background rounded-lg border border-border/50">
                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                  log.status === 'critical' ? 'bg-critical' : log.status === 'warning' ? 'bg-warning' : 'bg-info'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{log.event}</p>
                  <p className="text-sm text-foreground-secondary mt-1">{log.detail}</p>
                  <p className="text-xs text-foreground-tertiary mt-2">{new Date(log.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
          <div className="space-y-3">
            {([
              { label: 'Manage Supervisors',  href: '/admin/supervisors',  Icon: Users,     color: 'primary' },
              { label: 'View Workers',         href: '/admin/workers',      Icon: UserCheck, color: 'success' },
              { label: 'Manage Departments',   href: '/admin/departments',  Icon: Building2, color: 'info'    },
            ] as const).map(({ label, href, Icon, color }) => (
              <Link key={href} href={href}
                className={`flex items-center justify-between p-4 rounded-xl border border-border
                  bg-background hover:bg-${color}/5 hover:border-${color}/30 transition-colors group`}>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 bg-${color}/10 rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 text-${color}`} />
                  </div>
                  <span className="text-sm font-medium text-foreground">{label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-foreground-tertiary group-hover:text-foreground transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
