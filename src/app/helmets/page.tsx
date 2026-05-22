'use client';

import { mockHelmets } from '@/lib/mock-data';
import { Signal, Zap, Thermometer, Droplets, AlertTriangle, Shield } from 'lucide-react';

export default function HelmetMonitoring() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Real-time Helmet Monitoring</h2>
        <p className="text-foreground-secondary mt-1">Live sensor data from all active helmets</p>
      </div>

      <div className="space-y-4">
        {mockHelmets.map((helmet) => (
          <div
            key={helmet.id}
            className="bg-background-secondary border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Worker Info */}
              <div>
                <p className="text-foreground-secondary text-sm">Worker</p>
                <p className="text-lg font-semibold text-foreground mt-1">{helmet.workerName}</p>
                <p className="text-xs text-foreground-tertiary mt-2">{helmet.id}</p>
              </div>

              {/* Status */}
              <div>
                <p className="text-foreground-secondary text-sm">Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      helmet.status === 'active'
                        ? 'bg-success'
                        : helmet.status === 'alarm'
                        ? 'bg-critical'
                        : 'bg-foreground-tertiary'
                    }`}
                  />
                  <p className="font-semibold text-foreground capitalize">
                    {helmet.status}
                  </p>
                </div>
              </div>

              {/* CO Level */}
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-foreground-secondary text-sm">CO Level</p>
                  <Zap className="w-4 h-4 text-warning" />
                </div>
                <p className="text-2xl font-bold text-foreground mt-1">{helmet.co} ppm</p>
                <p className="text-xs text-foreground-tertiary mt-1">
                  {helmet.co > 40 ? 'Critical' : helmet.co > 20 ? 'Warning' : 'Safe'}
                </p>
              </div>

              {/* CH4 Level */}
              <div>
                <p className="text-foreground-secondary text-sm">CH4 Level</p>
                <p className="text-2xl font-bold text-foreground mt-1">{helmet.ch4.toFixed(1)}%</p>
                <p className="text-xs text-foreground-tertiary mt-1">
                  {helmet.ch4 > 1.5 ? 'Critical' : helmet.ch4 > 0.8 ? 'Warning' : 'Safe'}
                </p>
              </div>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6 pt-6 border-t border-border/50">
              {/* Temperature */}
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-foreground-secondary text-sm">Temperature</p>
                  <Thermometer className="w-4 h-4 text-warning" />
                </div>
                <p className="text-xl font-bold text-foreground mt-1">{helmet.temperature}°C</p>
              </div>

              {/* Humidity */}
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-foreground-secondary text-sm">Humidity</p>
                  <Droplets className="w-4 h-4 text-primary" />
                </div>
                <p className="text-xl font-bold text-foreground mt-1">{helmet.humidity}%</p>
              </div>

              {/* Helmet Wear */}
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-foreground-secondary text-sm">Helmet Worn</p>
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <p className={`text-sm font-semibold mt-1 ${helmet.helmetWear ? 'text-success' : 'text-critical'}`}>
                  {helmet.helmetWear ? 'Yes' : 'No'}
                </p>
              </div>

              {/* Impact */}
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-foreground-secondary text-sm">Impact</p>
                  <AlertTriangle className="w-4 h-4 text-warning" />
                </div>
                <p className={`text-sm font-semibold mt-1 ${helmet.impactDetected ? 'text-critical' : 'text-success'}`}>
                  {helmet.impactDetected ? 'Detected' : 'None'}
                </p>
              </div>

              {/* Signal & Battery */}
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-foreground-secondary text-sm">Battery</p>
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <p className="text-xl font-bold text-foreground mt-1">{helmet.battery}%</p>
              </div>
            </div>

            {/* Last Update */}
            <div className="mt-4 text-xs text-foreground-tertiary">
              Updated: {new Date(helmet.lastUpdate).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
