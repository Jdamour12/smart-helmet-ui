'use client';

import { useNetworkHealth } from '@/hooks/use-analytics';
import { useGateways } from '@/hooks/use-gateways';
import type { Gateway } from '@/lib/types';
import { Wifi, Activity, RadioTower, TrendingUp } from 'lucide-react';

interface NetworkHealth {
  total_gateways: number;
  online: number;
  avg_packet_delivery_rate: number;
}

export default function NetworkStatus() {
  const { data: gwRaw, isLoading: gwLoading }       = useGateways();
  const { data: healthRaw, isLoading: healthLoading } = useNetworkHealth();

  const gwList = (gwRaw as Gateway[] | undefined) ?? [];
  const health = healthRaw as NetworkHealth | undefined;
  const loading = gwLoading || healthLoading;

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <p className="text-foreground-secondary">Loading...</p>
      </div>
    );
  }

  const onlineGateways = health?.online ?? gwList.filter(g => g.status === 'online').length;
  const totalGateways  = health?.total_gateways ?? gwList.length;
  const totalConnected = gwList.reduce((s, g) => s + (g.connected_helmets ?? 0), 0);
  const avgSignal      = gwList.length > 0
    ? (gwList.reduce((s, g) => s + (g.signal_strength ?? 0), 0) / gwList.length).toFixed(0)
    : '0';
  const deliveryRate   = ((health?.avg_packet_delivery_rate ?? 0) * 100).toFixed(1);
  const packetLoss     = (100 - parseFloat(deliveryRate)).toFixed(1);
  const gwAvailPct     = totalGateways > 0 ? ((onlineGateways / totalGateways) * 100).toFixed(0) : '0';

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Network Status & Gateways</h2>
        <p className="text-foreground-secondary mt-1">LoRa gateway connectivity and network performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Gateways Online</p>
              <p className="text-3xl font-bold text-success mt-2">{onlineGateways}/{totalGateways}</p>
              <p className="text-xs text-foreground-tertiary mt-2">All systems operational</p>
            </div>
            <div className="bg-success/10 p-3 rounded-lg"><RadioTower className="w-6 h-6 text-success" /></div>
          </div>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Connected Helmets</p>
              <p className="text-3xl font-bold text-foreground mt-2">{totalConnected}</p>
              <p className="text-xs text-foreground-tertiary mt-2">Active connections</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg"><Activity className="w-6 h-6 text-primary" /></div>
          </div>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Packet Delivery</p>
              <p className="text-3xl font-bold text-success mt-2">{deliveryRate}%</p>
              <p className="text-xs text-foreground-tertiary mt-2">Delivery rate</p>
            </div>
            <div className="bg-success/10 p-3 rounded-lg"><Wifi className="w-6 h-6 text-success" /></div>
          </div>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Signal Strength</p>
              <p className="text-3xl font-bold text-foreground mt-2">{avgSignal} dBm</p>
              <p className="text-xs text-foreground-tertiary mt-2">Average RSSI</p>
            </div>
            <div className="bg-warning/10 p-3 rounded-lg"><TrendingUp className="w-6 h-6 text-warning" /></div>
          </div>
        </div>
      </div>

      <div className="bg-background-secondary border border-border rounded-lg p-6 overflow-x-auto">
        <h3 className="text-lg font-semibold text-foreground mb-4">Gateway Details</h3>
        {gwList.length === 0 ? (
          <p className="text-sm text-foreground-secondary">No gateways registered.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">Gateway ID</th>
                <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">Location</th>
                <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">Status</th>
                <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">Connected</th>
                <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">Signal</th>
                <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">Last Heartbeat</th>
              </tr>
            </thead>
            <tbody>
              {gwList.map((gw) => (
                <tr key={gw.id} className="border-b border-border/50 hover:bg-background/50">
                  <td className="px-4 py-3 text-foreground text-sm font-medium">{gw.id}</td>
                  <td className="px-4 py-3 text-foreground text-sm">{gw.location}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded font-medium ${
                      gw.status === 'online' ? 'bg-success/10 text-success' : 'bg-critical/10 text-critical'
                    }`}>
                      {(gw.status ?? 'offline').charAt(0).toUpperCase() + (gw.status ?? 'offline').slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-foreground text-sm">{gw.connected_helmets} devices</td>
                  <td className="px-4 py-3 text-foreground text-sm">{gw.signal_strength} dBm</td>
                  <td className="px-4 py-3 text-foreground text-sm">{new Date(gw.last_heartbeat).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Network Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-foreground-secondary text-sm">Gateway Availability</p>
                <p className="text-lg font-bold text-success">{gwAvailPct}%</p>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div className="h-full bg-success" style={{ width: `${gwAvailPct}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-foreground-secondary text-sm">Packet Delivery Rate</p>
                <p className="text-lg font-bold text-success">{deliveryRate}%</p>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div className="h-full bg-success" style={{ width: `${deliveryRate}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-foreground-secondary text-sm">Packet Loss</p>
                <p className={`text-lg font-bold ${parseFloat(packetLoss) > 5 ? 'text-warning' : 'text-success'}`}>{packetLoss}%</p>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div className={`h-full ${parseFloat(packetLoss) > 5 ? 'bg-warning' : 'bg-success'}`}
                  style={{ width: `${Math.min(parseFloat(packetLoss) * 10, 100)}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Device Distribution</h3>
          {gwList.length === 0 ? (
            <p className="text-sm text-foreground-secondary">No gateways registered.</p>
          ) : (
            <div className="space-y-3">
              {gwList.map((gw) => (
                <div key={gw.id}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-foreground-secondary text-sm">{gw.location}</p>
                    <p className="text-sm font-semibold text-foreground">{gw.connected_helmets} helmets</p>
                  </div>
                  <div className="h-2 bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: totalConnected > 0 ? `${((gw.connected_helmets ?? 0) / totalConnected) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
