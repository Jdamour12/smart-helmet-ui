'use client';

import { useEffect, useState } from 'react';
import { Download, AlertCircle } from 'lucide-react';
import { reports as reportsApi } from '@/lib/api';

interface AuditLog {
  id: string;
  event: string;
  detail: string;
  status: string;
  timestamp: string;
}

export default function ReportsPage() {
  const [logs, setLogs]       = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await reportsApi.auditLogs({ limit: '50' });
        const data = res as { logs?: AuditLog[] } | AuditLog[];
        setLogs(Array.isArray(data) ? data : (data as { logs?: AuditLog[] }).logs ?? []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const criticalCount = logs.filter(l => l.status === 'critical').length;
  const warningCount  = logs.filter(l => l.status === 'warning').length;

  const handleExport = async () => {
    setExporting(true);
    try {
      await reportsApi.export({ type: 'audit-logs', format: 'csv' });
    } catch {
      // Export may not be implemented yet
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Reports & Audit Logs</h2>
          <p className="text-foreground-secondary mt-1">System activity tracking and compliance reports</p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-60">
          <Download className="w-5 h-5" />
          {exporting ? 'Exporting...' : 'Export Report'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <p className="text-foreground-secondary text-sm font-medium">Total Logs</p>
          <p className="text-3xl font-bold text-foreground mt-2">{loading ? '—' : logs.length}</p>
          <p className="text-xs text-foreground-tertiary mt-2">Loaded entries</p>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <p className="text-foreground-secondary text-sm font-medium">Critical Events</p>
          <p className="text-3xl font-bold text-critical mt-2">{loading ? '—' : criticalCount}</p>
          <p className="text-xs text-critical mt-2">Logged</p>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <p className="text-foreground-secondary text-sm font-medium">Warning Events</p>
          <p className="text-3xl font-bold text-warning mt-2">{loading ? '—' : warningCount}</p>
          <p className="text-xs text-foreground-tertiary mt-2">Recorded</p>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <p className="text-foreground-secondary text-sm font-medium">Info Events</p>
          <p className="text-3xl font-bold text-info mt-2">{loading ? '—' : logs.length - criticalCount - warningCount}</p>
          <p className="text-xs text-foreground-tertiary mt-2">Informational</p>
        </div>
      </div>

      <div className="bg-background-secondary border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Audit Log Entries</h3>
        {loading ? (
          <p className="text-sm text-foreground-secondary py-8 text-center">Loading...</p>
        ) : logs.length === 0 ? (
          <p className="text-sm text-foreground-secondary py-8 text-center">No audit logs available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">Timestamp</th>
                  <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">Event</th>
                  <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">Details</th>
                  <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">Severity</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-border/50 hover:bg-background transition-colors">
                    <td className="py-3 px-4 text-foreground-secondary text-sm">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-foreground font-medium text-sm">{log.event}</td>
                    <td className="py-3 px-4 text-foreground-secondary text-sm truncate max-w-xs">{log.detail}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1 w-fit ${
                        log.status === 'critical'
                          ? 'bg-critical/10 text-critical'
                          : log.status === 'warning'
                            ? 'bg-warning/10 text-warning'
                            : 'bg-info/10 text-info'
                      }`}>
                        {log.status === 'critical' && <AlertCircle className="w-3 h-3" />}
                        {(log.status ?? "info").charAt(0).toUpperCase() + (log.status ?? "info").slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-background-secondary border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Report Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Alert Report',      description: 'Summary of all alerts',           type: 'alerts',     format: 'csv' },
            { name: 'Audit Log Export',  description: 'Full audit trail export',          type: 'audit-logs', format: 'csv' },
            { name: 'Sensor Data Report',description: 'Raw sensor readings export',       type: 'sensor-data',format: 'csv' },
          ].map((report) => (
            <div key={report.type} className="p-4 bg-background rounded-lg border border-border/50 hover:border-border transition-colors">
              <p className="text-foreground font-medium">{report.name}</p>
              <p className="text-sm text-foreground-secondary mt-1">{report.description}</p>
              <button
                onClick={async () => {
                  try { await reportsApi.export({ type: report.type, format: report.format }); } catch { /* not yet impl */ }
                }}
                className="mt-4 flex items-center gap-2 text-primary hover:text-primary-dark transition-colors text-sm font-medium">
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
