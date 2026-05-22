'use client';

import { Download, Eye, Trash2, AlertCircle } from 'lucide-react';
import { mockAuditLogs, adminSystemStats } from '@/lib/mock-data';

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Reports & Audit Logs</h2>
          <p className="text-foreground-secondary mt-1">System activity tracking and compliance reports</p>
        </div>
        <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export Report
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <p className="text-foreground-secondary text-sm font-medium">Total Logs</p>
          <p className="text-3xl font-bold text-foreground mt-2">1,247</p>
          <p className="text-xs text-foreground-tertiary mt-2">Last 30 days</p>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <p className="text-foreground-secondary text-sm font-medium">Critical Events</p>
          <p className="text-3xl font-bold text-critical mt-2">23</p>
          <p className="text-xs text-critical mt-2">Logged</p>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <p className="text-foreground-secondary text-sm font-medium">System Changes</p>
          <p className="text-3xl font-bold text-warning mt-2">84</p>
          <p className="text-xs text-foreground-tertiary mt-2">Recorded</p>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <p className="text-foreground-secondary text-sm font-medium">Compliance Status</p>
          <p className="text-3xl font-bold text-success mt-2">100%</p>
          <p className="text-xs text-success mt-2">Compliant</p>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-background-secondary border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Audit Log Entries</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">Timestamp</th>
                <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">Action</th>
                <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">Target</th>
                <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">User</th>
                <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">Details</th>
                <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">Severity</th>
                <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockAuditLogs.map((log) => (
                <tr key={log.id} className="border-b border-border/50 hover:bg-background transition-colors">
                  <td className="py-3 px-4 text-foreground-secondary text-sm">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-foreground font-medium text-sm">{log.action}</td>
                  <td className="py-3 px-4 text-foreground-secondary text-sm">{log.targetName}</td>
                  <td className="py-3 px-4 text-foreground-secondary text-sm">{log.user}</td>
                  <td className="py-3 px-4 text-foreground-secondary text-sm truncate max-w-xs">{log.details}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1 w-fit ${
                        log.severity === 'critical'
                          ? 'bg-critical/10 text-critical'
                          : log.severity === 'warning'
                          ? 'bg-warning/10 text-warning'
                          : 'bg-info/10 text-info'
                      }`}
                    >
                      {log.severity === 'critical' && <AlertCircle className="w-3 h-3" />}
                      {log.severity.charAt(0).toUpperCase() + log.severity.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-background rounded transition-colors" title="View">
                        <Eye className="w-4 h-4 text-info" />
                      </button>
                      <button className="p-2 hover:bg-background rounded transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4 text-critical" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Templates */}
      <div className="bg-background-secondary border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Report Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Daily System Report', description: 'Summary of system activity', file: 'daily_report.pdf' },
            { name: 'Weekly Compliance', description: 'Compliance metrics for the week', file: 'weekly_compliance.pdf' },
            { name: 'Monthly Analysis', description: 'Comprehensive monthly analytics', file: 'monthly_analysis.pdf' },
          ].map((report) => (
            <div key={report.file} className="p-4 bg-background rounded-lg border border-border/50 hover:border-border transition-colors cursor-pointer">
              <p className="text-foreground font-medium">{report.name}</p>
              <p className="text-sm text-foreground-secondary mt-1">{report.description}</p>
              <button className="mt-4 flex items-center gap-2 text-primary hover:text-primary-dark transition-colors text-sm font-medium">
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
