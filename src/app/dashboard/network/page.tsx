'use client';

import { mockGateways } from '@/lib/mock-data';
import { Wifi, Activity, RadioTower, TrendingUp } from 'lucide-react';

export default function NetworkStatus() {
  const onlineGateways = mockGateways.filter(g => g.status === 'online').length;
  const totalConnected = mockGateways.reduce((sum, g) => sum + g.connectedHelmets, 0);
  const avgRSSI = mockGateways.reduce((sum, g) => sum + Math.abs(g.rssi), 0) / mockGateways.length;
  const packetLoss = Math.max(...mockGateways.map(g => g.packetLoss || 0));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Network Status & Gateways</h2>
        <p className="text-foreground-secondary mt-1">LoRa gateway connectivity and network performance</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gateways Online */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Gateways Online</p>
              <p className="text-3xl font-bold text-success mt-2">{onlineGateways}/{mockGateways.length}</p>
              <p className="text-xs text-foreground-tertiary mt-2">All systems operational</p>
            </div>
            <div className="bg-success/10 p-3 rounded-lg">
              <RadioTower className="w-6 h-6 text-success" />
            </div>
          </div>
        </div>

        {/* Total Connected Helmets */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Connected Helmets</p>
              <p className="text-3xl font-bold text-foreground mt-2">{totalConnected}</p>
              <p className="text-xs text-foreground-tertiary mt-2">Active connections</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        {/* Network Health */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Network Health</p>
              <p className="text-3xl font-bold text-success mt-2">99.8%</p>
              <p className="text-xs text-foreground-tertiary mt-2">Excellent uptime</p>
            </div>
            <div className="bg-success/10 p-3 rounded-lg">
              <Wifi className="w-6 h-6 text-success" />
            </div>
          </div>
        </div>

        {/* Avg Signal Strength */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Signal Strength</p>
              <p className="text-3xl font-bold text-foreground mt-2">{avgRSSI.toFixed(0)} dBm</p>
              <p className="text-xs text-foreground-tertiary mt-2">Average RSSI</p>
            </div>
            <div className="bg-warning/10 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-warning" />
            </div>
          </div>
        </div>
      </div>

      {/* Gateway Details */}
      <div className="bg-background-secondary border border-border rounded-lg p-6 overflow-x-auto">
        <h3 className="text-lg font-semibold text-foreground mb-4">Gateway Details</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">Gateway ID</th>
              <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">Location</th>
              <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">Connected</th>
              <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">Signal (RSSI)</th>
              <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">Uptime</th>
            </tr>
          </thead>
          <tbody>
            {mockGateways.map((gateway) => (
              <tr key={gateway.id} className="border-b border-border/50 hover:bg-background/50">
                <td className="px-4 py-3 text-foreground text-sm font-medium">{gateway.id}</td>
                <td className="px-4 py-3 text-foreground text-sm">{gateway.location}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded font-medium ${
                    gateway.status === 'online' ? 'bg-success/10 text-success' : 'bg-critical/10 text-critical'
                  }`}>
                    {gateway.status.charAt(0).toUpperCase() + gateway.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3 text-foreground text-sm">{gateway.connectedHelmets} devices</td>
                <td className="px-4 py-3 text-foreground text-sm">{gateway.rssi} dBm</td>
                <td className="px-4 py-3 text-foreground text-sm">{gateway.uptime}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Network Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gateway Metrics */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Network Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-foreground-secondary text-sm">Network Uptime</p>
                <p className="text-lg font-bold text-success">99.8%</p>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div className="h-full bg-success" style={{ width: '99.8%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-foreground-secondary text-sm">Gateway Availability</p>
                <p className="text-lg font-bold text-success">{((onlineGateways / mockGateways.length) * 100).toFixed(0)}%</p>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div className="h-full bg-success" style={{ width: `${(onlineGateways / mockGateways.length) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-foreground-secondary text-sm">Packet Loss</p>
                <p className={`text-lg font-bold ${packetLoss > 5 ? 'text-warning' : 'text-success'}`}>{packetLoss}%</p>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div className={`h-full ${packetLoss > 5 ? 'bg-warning' : 'bg-success'}`} style={{ width: `${Math.min(packetLoss * 10, 100)}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Connection Distribution */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Device Distribution</h3>
          <div className="space-y-3">
            {mockGateways.map((gateway) => (
              <div key={gateway.id}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-foreground-secondary text-sm">{gateway.location}</p>
                  <p className="text-sm font-semibold text-foreground">{gateway.connectedHelmets} helmets</p>
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${(gateway.connectedHelmets / totalConnected) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
