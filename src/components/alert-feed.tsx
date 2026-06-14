import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import type { Alert } from '@/lib/types';

interface AlertFeedProps {
  alerts: Alert[];
  maxItems?: number;
}

export function AlertFeed({ alerts, maxItems = 8 }: AlertFeedProps) {
  const displayAlerts = alerts.slice(0, maxItems);
  const unreadAlerts = alerts.filter((a) => !a.resolved);

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-l-4 border-red-500 bg-red-50';
      case 'warning':
        return 'border-l-4 border-yellow-500 bg-yellow-50';
      default:
        return 'border-l-4 border-blue-500 bg-blue-50';
    }
  };
  
  const getAlertLabel = (alert: Alert) => {
    if (alert.type === 'multi') return 'AI Danger Alert';
    return alert.level.charAt(0).toUpperCase() + alert.level.slice(1);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Alert Feed</h3>
          {unreadAlerts.length > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {unreadAlerts.length} Unread
            </span>
          )}
        </div>
      </div>

      <div className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
        {displayAlerts.length === 0 ? (
          <div className="p-6 text-center">
            <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-600">No alerts at this time</p>
          </div>
        ) : (
          displayAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`px-6 py-4 flex gap-4 ${getAlertColor(alert.level)} transition-colors`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {alert.type === 'multi' ? <AlertTriangle className="w-5 h-5 text-red-600" /> : getAlertIcon(alert.level)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {alert.worker_name}
                    </p>
                    <p className="text-sm text-slate-700 mt-1">{alert.message}</p>
                  </div>
                  <span className={`text-xs whitespace-nowrap py-1 px-2 rounded ${
                    alert.type === 'multi' ? 'bg-red-200 text-red-700' : alert.level === 'critical'
                      ? 'bg-red-200 text-red-700'
                      : alert.level === 'warning'
                        ? 'bg-yellow-200 text-yellow-700'
                        : 'bg-blue-200 text-blue-700'
                  }`}>
                    {getAlertLabel(alert)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {formatTime(alert.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
