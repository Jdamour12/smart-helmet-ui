interface StatusIndicatorProps {
  label: string;
  value: number;
  unit?: string;
  max?: number;
  safeThreshold?: number;
  warningThreshold?: number;
  criticalThreshold?: number;
  compact?: boolean;
}

export function StatusIndicator({
  label,
  value,
  unit,
  max = 100,
  safeThreshold,
  warningThreshold,
  criticalThreshold,
  compact = false,
}: StatusIndicatorProps) {
  let statusColor = 'bg-gray-200';
  let textColor = 'text-gray-700';
  let badgeColor = 'bg-gray-100 text-gray-700';

  if (criticalThreshold !== undefined && value >= criticalThreshold) {
    statusColor = 'bg-red-500';
    textColor = 'text-red-700';
    badgeColor = 'bg-red-100 text-red-700';
  } else if (warningThreshold !== undefined && value >= warningThreshold) {
    statusColor = 'bg-yellow-500';
    textColor = 'text-yellow-700';
    badgeColor = 'bg-yellow-100 text-yellow-700';
  } else if (safeThreshold !== undefined && value <= safeThreshold) {
    statusColor = 'bg-green-500';
    textColor = 'text-green-700';
    badgeColor = 'bg-green-100 text-green-700';
  }

  const percentage = Math.min((value / max) * 100, 100);

  if (compact) {
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-700">{label}</span>
          <span className={`text-xs font-bold ${textColor}`}>
            {value.toFixed(1)}{unit || ''}
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${statusColor}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className={`text-lg font-bold ${textColor}`}>
          {value.toFixed(1)}{unit || ''}
        </span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${statusColor}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
