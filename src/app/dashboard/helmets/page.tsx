'use client';

import { mockHelmets } from '@/lib/mock-data';
import { Radio, Users, AlertTriangle, Zap, Plus, Eye, Edit2, Trash2 } from 'lucide-react';

export default function HelmetMonitoring() {
  const activeHelmets = mockHelmets.filter(h => h.status === 'active').length;
  const criticalHelmets = mockHelmets.filter(h => h.status === 'alarm').length;
  const avgBattery = (mockHelmets.reduce((sum, h) => sum + h.battery, 0) / mockHelmets.length).toFixed(1);
  const wearingHelmet = mockHelmets.filter(h => h.helmetWear).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Real-time Helmet Monitoring</h2>
          <p className="text-foreground-secondary mt-1">Live sensor data from all active helmets</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors font-medium">
          <Plus className="w-5 h-5" />
          Add Worker
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Helmets Card */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Active Helmets</p>
              <p className="text-3xl font-bold text-foreground mt-2">{activeHelmets}</p>
              <p className="text-xs text-foreground-tertiary mt-2">of {mockHelmets.length} total</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <Radio className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        {/* Wearing Helmet Card */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Helmet Compliance</p>
              <p className="text-3xl font-bold text-foreground mt-2">{wearingHelmet}</p>
              <p className="text-xs text-foreground-tertiary mt-2">Workers wearing helmets</p>
            </div>
            <div className="bg-success/10 p-3 rounded-lg">
              <Users className="w-6 h-6 text-success" />
            </div>
          </div>
        </div>

        {/* Critical Alerts Card */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Critical Status</p>
              <p className="text-3xl font-bold text-critical mt-2">{criticalHelmets}</p>
              <p className="text-xs text-foreground-tertiary mt-2">Requiring attention</p>
            </div>
            <div className="bg-critical/10 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-critical" />
            </div>
          </div>
        </div>

        {/* Average Battery Card */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Avg Battery</p>
              <p className="text-3xl font-bold text-foreground mt-2">{avgBattery}%</p>
              <p className="text-xs text-foreground-tertiary mt-2">Fleet average</p>
            </div>
            <div className="bg-warning/10 p-3 rounded-lg">
              <Zap className="w-6 h-6 text-warning" />
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-background-secondary border border-border rounded-lg p-6 overflow-x-auto">
        <h3 className="text-lg font-semibold text-foreground mb-4">Helmet Details</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">Worker</th>
              <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">CO/CH4</th>
              <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">Temp/Humidity</th>
              <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">Helmet Wear</th>
              <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">Battery</th>
              <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockHelmets.map((helmet) => (
              <tr key={helmet.id} className="border-b border-border/50 hover:bg-background/50 transition-colors">
                <td className="px-4 py-4 text-foreground text-sm font-medium">{helmet.workerName}</td>
                <td className="px-4 py-4">
                  <span className={`text-xs px-2 py-1 rounded font-medium flex items-center gap-1 w-fit ${
                    helmet.status === 'active' ? 'bg-success/10 text-success' :
                    helmet.status === 'alarm' ? 'bg-critical/10 text-critical' :
                    'bg-foreground-tertiary/10 text-foreground-tertiary'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      helmet.status === 'active' ? 'bg-success' :
                      helmet.status === 'alarm' ? 'bg-critical' :
                      'bg-foreground-tertiary'
                    }`} />
                    {helmet.status.charAt(0).toUpperCase() + helmet.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-4 text-foreground text-sm">{helmet.co} ppm / {helmet.ch4.toFixed(1)}%</td>
                <td className="px-4 py-4 text-foreground text-sm">{helmet.temperature}°C / {helmet.humidity}%</td>
                <td className="px-4 py-4">
                  <span className={`text-xs px-2 py-1 rounded font-medium ${
                    helmet.helmetWear ? 'bg-success/10 text-success' : 'bg-critical/10 text-critical'
                  }`}>
                    {helmet.helmetWear ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-16 bg-background rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${helmet.battery > 60 ? 'bg-success' : helmet.battery > 30 ? 'bg-warning' : 'bg-critical'}`}
                        style={{ width: `${helmet.battery}%` }}
                      />
                    </div>
                    <span className="text-xs text-foreground-secondary">{helmet.battery}%</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-background rounded transition-colors" title="View">
                      <Eye className="w-4 h-4 text-primary" />
                    </button>
                    <button className="p-1.5 hover:bg-background rounded transition-colors" title="Edit">
                      <Edit2 className="w-4 h-4 text-warning" />
                    </button>
                    <button className="p-1.5 hover:bg-background rounded transition-colors" title="Delete">
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
  );
}
