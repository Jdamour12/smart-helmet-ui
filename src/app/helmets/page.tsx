'use client';

import { useHelmetsWithReadings } from '@/hooks/use-helmets';
import type { Helmet } from '@/lib/types';
import { Signal, Zap, Thermometer, Droplets, AlertTriangle, Shield } from 'lucide-react';

export default function HelmetMonitoring() {
  const { data: raw, isLoading } = useHelmetsWithReadings();
  const helmetList = (raw as Helmet[] | undefined) ?? [];

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <p className="text-foreground-secondary">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Real-time Helmet Monitoring</h2>
        <p className="text-foreground-secondary mt-1">Live sensor data from all active helmets</p>
      </div>

      {helmetList.length === 0 ? (
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <p className="text-foreground-secondary font-medium">No helmets registered</p>
            <p className="text-foreground-tertiary text-sm mt-1">Register helmets in the admin portal to see live data</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {helmetList.map((helmet) => (
            <div
              key={helmet.id}
              className="bg-background-secondary border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <p className="text-foreground-secondary text-sm">Worker</p>
                  <p className="text-lg font-semibold text-foreground mt-1">{helmet.worker_name}</p>
                  <p className="text-xs text-foreground-tertiary mt-2">{helmet.id}</p>
                </div>

                <div>
                  <p className="text-foreground-secondary text-sm">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-3 h-3 rounded-full ${
                      helmet.status === 'active' ? 'bg-success'
                        : helmet.status === 'alarm' ? 'bg-critical'
                          : 'bg-foreground-tertiary'
                    }`} />
                    <p className="font-semibold text-foreground capitalize">{helmet.status}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-foreground-secondary text-sm">CO Level</p>
                    <Zap className="w-4 h-4 text-warning" />
                  </div>
                  <p className="text-2xl font-bold text-foreground mt-1">{(helmet.co ?? 0).toFixed(1)} ppm</p>
                  <p className={`text-xs mt-1 ${helmet.co > 200 ? 'text-critical' : helmet.co > 50 ? 'text-warning' : 'text-success'}`}>
                    {helmet.co > 200 ? 'Critical' : helmet.co > 50 ? 'Warning' : 'Safe'}
                  </p>
                </div>

                <div>
                  <p className="text-foreground-secondary text-sm">CH4 Level</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{(helmet.ch4 ?? 0).toFixed(2)}%</p>
                  <p className={`text-xs mt-1 ${helmet.ch4 > 2 ? 'text-critical' : helmet.ch4 > 1 ? 'text-warning' : 'text-success'}`}>
                    {helmet.ch4 > 2 ? 'Critical' : helmet.ch4 > 1 ? 'Warning' : 'Safe'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6 pt-6 border-t border-border/50">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-foreground-secondary text-sm">Temperature</p>
                    <Thermometer className="w-4 h-4 text-warning" />
                  </div>
                  <p className="text-xl font-bold text-foreground mt-1">{(helmet.temperature ?? 0).toFixed(1)}°C</p>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-foreground-secondary text-sm">Humidity</p>
                    <Droplets className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-xl font-bold text-foreground mt-1">{(helmet.humidity ?? 0).toFixed(1)}%</p>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-foreground-secondary text-sm">Helmet Worn</p>
                    <Shield className="w-4 h-4 text-primary" />
                  </div>
                  <p className={`text-sm font-semibold mt-1 ${helmet.helmet_wear ? 'text-success' : 'text-critical'}`}>
                    {helmet.helmet_wear ? 'Yes' : 'No'}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-foreground-secondary text-sm">Impact</p>
                    <AlertTriangle className="w-4 h-4 text-warning" />
                  </div>
                  <p className={`text-sm font-semibold mt-1 ${helmet.impact_detected ? 'text-critical' : 'text-success'}`}>
                    {helmet.impact_detected ? 'Detected' : 'None'}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-foreground-secondary text-sm">Battery</p>
                    <Signal className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-xl font-bold text-foreground mt-1">{helmet.battery ?? 0}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
