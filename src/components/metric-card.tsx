interface MetricCardProps {
  title: string;
  value: number | string;
  unit?: string;
  status: 'safe' | 'warning' | 'critical' | 'info';
  icon?: string;
}

const statusStyles = {
  safe: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    badge: 'bg-green-100',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-700',
    badge: 'bg-yellow-100',
  },
  critical: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    badge: 'bg-red-100',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    badge: 'bg-blue-100',
  },
};

export function MetricCard({
  title,
  value,
  unit,
  status,
  icon,
}: MetricCardProps) {
  const styles = statusStyles[status];

  return (
    <div className={`rounded-lg border-2 ${styles.border} ${styles.bg} p-4`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
            {title}
          </p>
          <p className={`text-3xl font-bold mt-2 ${styles.text}`}>
            {value}
            {unit && <span className="text-sm ml-1">{unit}</span>}
          </p>
        </div>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
    </div>
  );
}
