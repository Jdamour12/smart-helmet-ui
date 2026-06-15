'use client';

import { useNetworkHealth } from '@/hooks/use-analytics';
import { Activity, RadioTower, Wifi, TrendingUp } from 'lucide-react';

interface NetworkHealth {
  total_gateways: number;
  online: number;
  avg_packet_delivery_rate: number;
}

export default function NetworkStatus() {
  const { data: healthRaw, isLoading } = useNetworkHealth();
  const health = healthRaw as NetworkHealth | undefined;

  const online       = health?.online ?? 0;
  const total        = health?.total_gateways ?? 0;
  const deliveryRate = ((health?.avg_packet_delivery_rate ?? 0) * 100).toFixed(1);
  const packetLoss   = (100 - parseFloat(deliveryRate)).toFixed(1);
  const availPct     = total > 0 ? ((online / total) * 100).toFixed(0) : '0';

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <p className="text-foreground-secondary">Loading network status...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Network Status</h2>
        <p className="text-foreground-secondary mt-1">LoRa network performance and connectivity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Nodes Online</p>
              <p className="text-3xl font-bold text-success mt-2">{online}/{total}</p>
              <p className="text-xs text-foreground-tertiary mt-2">Active connections</p>
            </div>
            <div className="bg-success/10 p-3 rounded-lg"><RadioTower className="w-6 h-6 text-success" /></div>
          </div>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Availability</p>
              <p className="text-3xl font-bold text-foreground mt-2">{availPct}%</p>
              <p className="text-xs text-foreground-tertiary mt-2">Network uptime</p>
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
              <p className="text-foreground-secondary text-sm font-medium">Packet Loss</p>
              <p className={`text-3xl font-bold mt-2 ${parseFloat(packetLoss) > 5 ? 'text-warning' : 'text-success'}`}>
                {packetLoss}%
              </p>
              <p className="text-xs text-foreground-tertiary mt-2">Lost packets</p>
            </div>
            <div className="bg-warning/10 p-3 rounded-lg"><TrendingUp className="w-6 h-6 text-warning" /></div>
          </div>
        </div>
      </div>

      <div className="bg-background-secondary border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Network Metrics</h3>
        <div className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-foreground-secondary text-sm">Node Availability</p>
              <p className="text-lg font-bold text-success">{availPct}%</p>
            </div>
            <div className="h-2 bg-background rounded-full overflow-hidden">
              <div className="h-full bg-success transition-all" style={{ width: `${availPct}%` }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-foreground-secondary text-sm">Packet Delivery Rate</p>
              <p className="text-lg font-bold text-success">{deliveryRate}%</p>
            </div>
            <div className="h-2 bg-background rounded-full overflow-hidden">
              <div className="h-full bg-success transition-all" style={{ width: `${deliveryRate}%` }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-foreground-secondary text-sm">Packet Loss</p>
              <p className={`text-lg font-bold ${parseFloat(packetLoss) > 5 ? 'text-warning' : 'text-success'}`}>{packetLoss}%</p>
            </div>
            <div className="h-2 bg-background rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${parseFloat(packetLoss) > 5 ? 'bg-warning' : 'bg-success'}`}
                style={{ width: `${Math.min(parseFloat(packetLoss) * 10, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
