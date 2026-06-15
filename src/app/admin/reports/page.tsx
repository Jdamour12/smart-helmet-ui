'use client';

import { useState } from 'react';
import { Download, AlertCircle, FileText, Loader2, Users, Shield, BellRing } from 'lucide-react';
import { useAuditLogs } from '@/hooks/use-reports';
import { download } from '@/lib/reports';
import type { AuditLog } from '@/lib/types';

type DownloadKey = 'alerts-csv' | 'alerts-pdf' | 'workers-csv' | 'workers-pdf' | 'safety-pdf';

export default function ReportsPage() {
  const { data: auditRaw, isLoading } = useAuditLogs({ limit: '50' });
  const [downloading, setDownloading] = useState<DownloadKey | null>(null);
  const [dlError, setDlError] = useState<string | null>(null);

  const data = auditRaw as { logs?: AuditLog[] } | AuditLog[] | undefined;
  const logs: AuditLog[] = Array.isArray(data) ? data : (data as { logs?: AuditLog[] } | undefined)?.logs ?? [];

  const criticalCount = logs.filter(l => l.status === 'critical').length;
  const warningCount  = logs.filter(l => l.status === 'warning').length;

  async function handleDownload(key: DownloadKey, fn: () => Promise<void>) {
    setDlError(null);
    setDownloading(key);
    try { await fn(); }
    catch (e) { setDlError((e as Error).message ?? 'Download failed'); }
    finally   { setDownloading(null); }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Reports & Audit Logs</h2>
        <p className="text-foreground-secondary mt-1">System activity tracking and compliance reports</p>
      </div>

      {dlError && (
        <div className="flex items-center gap-3 p-4 bg-critical/10 border border-critical/30 rounded-lg text-critical text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {dlError}
          <button onClick={() => setDlError(null)} className="ml-auto text-critical/70 hover:text-critical">✕</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <p className="text-foreground-secondary text-sm font-medium">Total Logs</p>
          <p className="text-3xl font-bold text-foreground mt-2">{isLoading ? '—' : logs.length}</p>
          <p className="text-xs text-foreground-tertiary mt-2">Loaded entries</p>
        </div>
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <p className="text-foreground-secondary text-sm font-medium">Critical Events</p>
          <p className="text-3xl font-bold text-critical mt-2">{isLoading ? '—' : criticalCount}</p>
          <p className="text-xs text-critical mt-2">Logged</p>
        </div>
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <p className="text-foreground-secondary text-sm font-medium">Warning Events</p>
          <p className="text-3xl font-bold text-warning mt-2">{isLoading ? '—' : warningCount}</p>
          <p className="text-xs text-foreground-tertiary mt-2">Recorded</p>
        </div>
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <p className="text-foreground-secondary text-sm font-medium">Info Events</p>
          <p className="text-3xl font-bold text-info mt-2">{isLoading ? '—' : logs.length - criticalCount - warningCount}</p>
          <p className="text-xs text-foreground-tertiary mt-2">Informational</p>
        </div>
      </div>

      {/* Download report cards */}
      <div className="bg-background-secondary border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-5">Download Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Alerts report */}
          <div className="p-5 bg-background rounded-xl border border-border/50 hover:border-border transition-colors">
            <div className="flex items-start gap-3 mb-5">
              <div className="w-10 h-10 bg-critical/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <BellRing className="w-5 h-5 text-critical" />
              </div>
              <div>
                <p className="text-foreground font-semibold">Alert Report</p>
                <p className="text-sm text-foreground-secondary mt-0.5">All system alerts</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleDownload('alerts-csv', () => download.alerts('csv'))}
                disabled={!!downloading}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-sm font-medium
                  border border-border rounded-lg hover:bg-background-secondary transition-colors
                  text-foreground disabled:opacity-50">
                {downloading === 'alerts-csv'
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Download className="w-4 h-4" />}
                CSV
              </button>
              <button
                onClick={() => handleDownload('alerts-pdf', () => download.alerts('pdf'))}
                disabled={!!downloading}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-sm font-medium
                  bg-critical text-white rounded-lg hover:bg-critical/90 transition-colors disabled:opacity-50">
                {downloading === 'alerts-pdf'
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <FileText className="w-4 h-4" />}
                PDF
              </button>
            </div>
          </div>

          {/* Workers report */}
          <div className="p-5 bg-background rounded-xl border border-border/50 hover:border-border transition-colors">
            <div className="flex items-start gap-3 mb-5">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-foreground font-semibold">Workers Report</p>
                <p className="text-sm text-foreground-secondary mt-0.5">All worker records</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleDownload('workers-csv', () => download.workers('csv'))}
                disabled={!!downloading}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-sm font-medium
                  border border-border rounded-lg hover:bg-background-secondary transition-colors
                  text-foreground disabled:opacity-50">
                {downloading === 'workers-csv'
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Download className="w-4 h-4" />}
                CSV
              </button>
              <button
                onClick={() => handleDownload('workers-pdf', () => download.workers('pdf'))}
                disabled={!!downloading}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-sm font-medium
                  bg-primary text-primary-foreground rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50">
                {downloading === 'workers-pdf'
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <FileText className="w-4 h-4" />}
                PDF
              </button>
            </div>
          </div>

          {/* Safety summary (PDF only) */}
          <div className="p-5 bg-background rounded-xl border border-border/50 hover:border-border transition-colors">
            <div className="flex items-start gap-3 mb-5">
              <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-foreground font-semibold">Safety Summary</p>
                <p className="text-sm text-foreground-secondary mt-0.5">Comprehensive safety PDF</p>
              </div>
            </div>
            <button
              onClick={() => handleDownload('safety-pdf', () => download.safetySummary())}
              disabled={!!downloading}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium
                bg-success text-white rounded-lg hover:bg-success/90 transition-colors disabled:opacity-50">
              {downloading === 'safety-pdf'
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <FileText className="w-4 h-4" />}
              Download PDF
            </button>
          </div>

        </div>
      </div>

      {/* Audit log table */}
      <div className="bg-background-secondary border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Audit Log Entries</h3>
        {isLoading ? (
          <p className="text-sm text-foreground-secondary py-8 text-center">Loading...</p>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-info/10 rounded-2xl flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-info" />
            </div>
            <p className="text-foreground-secondary font-medium">No audit logs yet</p>
            <p className="text-foreground-tertiary text-sm mt-1">Audit log entries will appear as users take actions</p>
          </div>
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
                        {(log.status ?? 'info').charAt(0).toUpperCase() + (log.status ?? 'info').slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
