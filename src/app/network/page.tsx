'use client';

import { mockGateways } from '@/lib/mock-data';
import { Wifi, Signal } from 'lucide-react';

export default function NetworkStatus() {
  const onlineGateways = mockGateways.filter(g => g.status === 'online').length;
  const totalConnected = mockGateways.reduce((sum, g) => sum + g.connected_helmets, 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Network Status & Gateways</h2>
        <p className="text-foreground-secondary mt-1">LoRa gateway connectivity and performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <p className="text-foreground-secondary text-sm">Gateways Online</p>
          <p className="text-3xl font-bold text-success mt-2">{onlineGateways}/{mockGateways.length}</p>
          <p className="text-xs text-foreground-tertiary mt-2">All systems operational</p>
        </div>
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <p className="text-foreground-secondary text-sm">Total Connected Helmets</p>
          <p className="text-3xl font-bold text-foreground mt-2">{totalConnected}</p>
          <p className="text-xs text-foreground-tertiary mt-2">Active connections</p>
        </div>
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <p className="text-foreground-secondary text-sm">Network Health</p>
          <p className="text-3xl font-bold text-success mt-2">99.8%</p>
          <p className="text-xs text-foreground-tertiary mt-2">Excellent uptime</p>
        </div>
      </div>

      {/* Gateway Details */}
      <div className="space-y-4">
        {mockGateways.map((gateway) => (
          <div
            key={gateway.id}
            className="bg-background-secondary border border-border rounded-lg p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gateway Info */}
              <div>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Wifi className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{gateway.id}</p>
                    <p className="text-sm text-foreground-secondary">{gateway.location}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground-secondary text-sm">Status</span>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${gateway.status === 'online' ? 'bg-success' : 'bg-critical'}`} />
                      <span className="text-foreground text-sm font-medium capitalize">
                        {gateway.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground-secondary text-sm">Connected Helmets</span>
                    <span className="text-foreground text-sm font-medium">{gateway.connected_helmets}</span>
                  </div>
                </div>
              </div>

              {/* Signal Strength */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Signal className="w-5 h-5 text-primary" />
                  <p className="text-foreground-secondary text-sm">Signal Strength</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-foreground text-sm">{gateway.signal_strength}%</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2">
                      <div 
                        className={`h-full rounded-full ${
                          gateway.signal_strength >= 80 ? 'bg-success' : gateway.signal_strength >= 60 ? 'bg-warning' : 'bg-critical'
                        }`}
                        style={{ width: `${gateway.signal_strength}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xs text-foreground-tertiary">
                    Last heartbeat: {new Date(gateway.last_heartbeat).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Network Performance */}
      <div className="bg-background-secondary border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Network Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-foreground-secondary text-sm mb-2">Average Latency</p>
            <p className="text-2xl font-bold text-foreground">45 ms</p>
            <p className="text-xs text-success mt-1">Optimal</p>
          </div>
          <div>
            <p className="text-foreground-secondary text-sm mb-2">Data Packet Loss</p>
            <p className="text-2xl font-bold text-foreground">0.2%</p>
            <p className="text-xs text-success mt-1">Excellent</p>
          </div>
          <div>
            <p className="text-foreground-secondary text-sm mb-2">System Availability</p>
            <p className="text-2xl font-bold text-foreground">99.8%</p>
            <p className="text-xs text-success mt-1">Highly reliable</p>
          </div>
        </div>
      </div>

      {/* Network Recommendations */}
      <div className="bg-background-secondary border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recommendations</h3>
        <div className="space-y-3">
          <div className="flex gap-3 p-3 bg-background rounded-lg border border-border/50">
            <span className="text-xl">✓</span>
            <div>
              <p className="text-foreground font-medium text-sm">Gateway Coverage Optimal</p>
              <p className="text-foreground-secondary text-xs mt-1">All mining areas have good signal coverage</p>
            </div>
          </div>
          <div className="flex gap-3 p-3 bg-background rounded-lg border border-border/50">
            <span className="text-xl">📡</span>
            <div>
              <p className="text-foreground font-medium text-sm">Regular Maintenance Schedule</p>
              <p className="text-foreground-secondary text-xs mt-1">Check gateway performance monthly</p>
            </div>
          </div>
          <div className="flex gap-3 p-3 bg-background rounded-lg border border-border/50">
            <span className="text-xl">⚙️</span>
            <div>
              <p className="text-foreground font-medium text-sm">Network Optimization</p>
              <p className="text-foreground-secondary text-xs mt-1">Consider adding a 4th gateway for redundancy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
