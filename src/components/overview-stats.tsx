import { AlertTriangle, Users, AlertCircle } from 'lucide-react';
import type { SystemStatus } from '@/lib/types';

interface OverviewStatsProps {
  status: SystemStatus;
}

export function OverviewStats({ status }: OverviewStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Active Helmets */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-slate-600 font-semibold uppercase">Active Helmets</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{status.activeHelmets}</p>
          </div>
          <Users className="w-5 h-5 text-blue-600" />
        </div>
      </div>

      {/* Warning Alerts */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-slate-600 font-semibold uppercase">Warnings</p>
            <p className="text-2xl font-bold text-yellow-600 mt-2">{status.warningAlerts}</p>
          </div>
          <AlertCircle className="w-5 h-5 text-yellow-600" />
        </div>
      </div>

      {/* Critical Alerts */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-slate-600 font-semibold uppercase">Critical</p>
            <p className="text-2xl font-bold text-red-600 mt-2">{status.criticalAlerts}</p>
          </div>
          <AlertTriangle className="w-5 h-5 text-red-600" />
        </div>
      </div>
    </div>
  );
}
