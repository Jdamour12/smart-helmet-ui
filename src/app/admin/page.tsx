"use client";

import { Users, UserCheck, Wifi, AlertTriangle } from "lucide-react";
import { useSupervisors } from "@/hooks/use-supervisors";
import { useWorkers } from "@/hooks/use-workers";
import { useGateways } from "@/hooks/use-gateways";
import { useAlertsByLevel } from "@/hooks/use-analytics";
import { useAuditLogs } from "@/hooks/use-reports";
import { useSystemPerformance } from "@/hooks/use-system";
import type { Supervisor, Worker, Gateway } from "@/lib/types";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface AuditLog { id: string; event: string; detail: string; status: string; timestamp: string; }
interface Performance { cpu_percent: number; memory: { percent: number }; disk: { percent: number }; }

export default function AdminDashboard() {
  const { data: supsRaw }    = useSupervisors();
  const { data: workersRaw } = useWorkers();
  const { data: gwRaw }      = useGateways();
  const { data: byLevelRaw } = useAlertsByLevel();
  const { data: auditRaw }   = useAuditLogs({ limit: '5' });
  const { data: perfRaw }    = useSystemPerformance();

  const supList    = (supsRaw as Supervisor[] | undefined) ?? [];
  const workerList = (workersRaw as Worker[] | undefined) ?? [];
  const gwList     = (gwRaw as Gateway[] | undefined) ?? [];
  const lv         = (byLevelRaw as { level: string; count: number }[] | undefined) ?? [];
  const auditData  = auditRaw as { logs?: AuditLog[] } | AuditLog[] | undefined;
  const auditLogs  = Array.isArray(auditData) ? auditData : (auditData as { logs?: AuditLog[] } | undefined)?.logs ?? [];
  const performance = perfRaw as Performance | undefined;

  const criticalCount = lv.find(x => x.level === 'critical')?.count ?? 0;
  const alertsToday   = lv.reduce((acc, x) => acc + x.count, 0);
  const onlineGateways = gwList.filter(g => g.status === 'online').length;
  const activeWorkers  = workerList.filter(w => w.status === 'active').length;
  const activeSups     = supList.filter(s => s.status === 'active').length;

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
              <p className="text-foreground-secondary text-sm font-medium">Gateway Status</p>
              <p className="text-3xl font-bold text-foreground mt-2">{onlineGateways}/{gwList.length}</p>
              <p className="text-xs text-warning mt-2">Online</p>
            </div>
            <div className="bg-warning/10 p-3 rounded-lg"><Wifi className="w-6 h-6 text-warning" /></div>
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
          <h3 className="text-lg font-semibold text-foreground mb-2">System Health (24h)</h3>
          <p className="text-xs text-foreground-tertiary mb-4">Endpoint not yet implemented — add <code className="bg-background px-1 rounded">GET /analytics/system-health-trends</code></p>
          <div className="h-[300px] flex items-center justify-center text-foreground-tertiary text-sm">Awaiting backend implementation</div>
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

      {/* Recent Activity + Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {auditLogs.length === 0 && <p className="text-sm text-foreground-secondary">No activity yet.</p>}
            {(auditLogs as AuditLog[]).map((log) => (
              <div key={log.id} className="flex items-start gap-4 p-3 bg-background rounded-lg border border-border/50">
                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${log.status === 'critical' ? 'bg-critical' : log.status === 'warning' ? 'bg-warning' : 'bg-info'}`} />
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
          <h3 className="text-lg font-semibold text-foreground">System Performance</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-foreground-secondary text-sm">CPU Usage</p>
                <p className="text-lg font-bold text-warning">{performance?.cpu_percent ?? 0}%</p>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div className="h-full bg-warning" style={{ width: `${performance?.cpu_percent ?? 0}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-foreground-secondary text-sm">Memory Usage</p>
                <p className="text-lg font-bold text-info">{performance?.memory?.percent ?? 0}%</p>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div className="h-full bg-info" style={{ width: `${performance?.memory?.percent ?? 0}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-foreground-secondary text-sm">Disk Usage</p>
                <p className="text-lg font-bold text-foreground">{performance?.disk?.percent ?? 0}%</p>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${performance?.disk?.percent ?? 0}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
