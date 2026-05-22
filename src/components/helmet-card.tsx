import { AlertTriangle, Zap, Signal, Battery } from 'lucide-react';
import { StatusIndicator } from './status-indicator';
import type { HelmetData } from '@/lib/types';

interface HelmetCardProps {
  helmet: HelmetData;
}

export function HelmetCard({ helmet }: HelmetCardProps) {
  const hasAlerts = helmet.activeAlerts.length > 0;
  const hasCritical = helmet.activeAlerts.some((a) => a.severity === 'critical');

  const getSignalStatus = (strength: number) => {
    if (strength > -70) return { text: 'Excellent', color: 'text-green-600' };
    if (strength > -80) return { text: 'Good', color: 'text-green-600' };
    if (strength > -90) return { text: 'Fair', color: 'text-yellow-600' };
    return { text: 'Poor', color: 'text-red-600' };
  };

  const signalStatus = getSignalStatus(helmet.signalStrength);

  return (
    <div
      className={`rounded-xl border-2 p-5 transition-all ${
        hasCritical
          ? 'border-red-300 bg-red-50 shadow-lg shadow-red-200'
          : hasAlerts
            ? 'border-yellow-300 bg-yellow-50'
            : 'border-slate-200 bg-white'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg text-slate-900">{helmet.workerName}</h3>
          <p className="text-xs text-slate-500">ID: {helmet.workerId}</p>
        </div>
        <div className="flex items-center gap-2">
          {hasCritical && (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              CRITICAL
            </div>
          )}
          {hasAlerts && !hasCritical && (
            <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              {helmet.activeAlerts.length} Alert
              {helmet.activeAlerts.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Helmet Worn */}
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${helmet.helmetWorn ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <div>
            <p className="text-xs text-slate-600">Helmet</p>
            <p className={`text-sm font-bold ${helmet.helmetWorn ? 'text-green-600' : 'text-red-600'}`}>
              {helmet.helmetWorn ? 'Worn' : 'Not Worn'}
            </p>
          </div>
        </div>

        {/* Impact Detection */}
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${helmet.impactDetected ? 'bg-red-500' : 'bg-green-500'}`}></span>
          <div>
            <p className="text-xs text-slate-600">Impact</p>
            <p className={`text-sm font-bold ${helmet.impactDetected ? 'text-red-600' : 'text-green-600'}`}>
              {helmet.impactDetected ? 'Detected!' : 'Normal'}
            </p>
          </div>
        </div>
      </div>

      {/* Gas Levels */}
      <div className="space-y-3 mb-4 pb-4 border-b border-slate-200">
        <StatusIndicator
          label="CO"
          value={helmet.co}
          unit="ppm"
          max={100}
          safeThreshold={35}
          warningThreshold={200}
          criticalThreshold={1200}
          compact
        />
        <StatusIndicator
          label="CH4"
          value={helmet.ch4}
          unit="%"
          max={2}
          safeThreshold={0.5}
          warningThreshold={1.25}
          criticalThreshold={5.0}
          compact
        />
      </div>

      {/* Environment */}
      <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-slate-200">
        <div>
          <p className="text-xs text-slate-600">Temperature</p>
          <p className="text-xl font-bold text-slate-900">{helmet.temperature}°C</p>
        </div>
        <div>
          <p className="text-xs text-slate-600">Humidity</p>
          <p className="text-xl font-bold text-slate-900">{helmet.humidity}%</p>
        </div>
      </div>

      {/* Connection & Battery */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Signal className={`w-4 h-4 ${signalStatus.color}`} />
          <div>
            <p className="text-slate-600">Signal</p>
            <p className={`font-semibold ${signalStatus.color}`}>{signalStatus.text}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Battery className={`w-4 h-4 ${helmet.batteryLevel < 20 ? 'text-red-600' : helmet.batteryLevel < 50 ? 'text-yellow-600' : 'text-green-600'}`} />
          <div>
            <p className="text-slate-600">Battery</p>
            <p className="font-semibold">{helmet.batteryLevel}%</p>
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      {helmet.activeAlerts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
          {helmet.activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`text-xs p-2 rounded ${
                alert.severity === 'critical'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              <p className="font-semibold">{alert.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
