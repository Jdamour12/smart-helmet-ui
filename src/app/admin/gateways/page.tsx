'use client';

import { Plus, Edit2, Trash2, Eye, Wifi, WifiOff } from 'lucide-react';
import { mockGateways, adminSystemStats } from '@/lib/mock-data';

export default function GatewaysPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Manage Gateways</h2>
          <p className="text-foreground-secondary mt-1">Monitor and configure network gateways</p>
        </div>
        <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Gateway
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Total Gateways</p>
              <p className="text-3xl font-bold text-foreground mt-2">{adminSystemStats.totalGateways}</p>
              <p className="text-xs text-foreground-tertiary mt-2">All devices</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-primary">{adminSystemStats.totalGateways}</span>
            </div>
          </div>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Online Gateways</p>
              <p className="text-3xl font-bold text-success mt-2">{adminSystemStats.onlineGateways}</p>
              <p className="text-xs text-success mt-2">Fully operational</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-success">{adminSystemStats.onlineGateways}</span>
            </div>
          </div>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Offline Gateways</p>
              <p className="text-3xl font-bold text-critical mt-2">
                {adminSystemStats.totalGateways - adminSystemStats.onlineGateways}
              </p>
              <p className="text-xs text-critical mt-2">Need attention</p>
            </div>
            <div className="w-12 h-12 bg-critical/10 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-critical">
                {adminSystemStats.totalGateways - adminSystemStats.onlineGateways}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Availability Rate</p>
              <p className="text-3xl font-bold text-info mt-2">
                {Math.round((adminSystemStats.onlineGateways / adminSystemStats.totalGateways) * 100)}%
              </p>
              <p className="text-xs text-foreground-tertiary mt-2">Network uptime</p>
            </div>
            <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-info">
                {Math.round((adminSystemStats.onlineGateways / adminSystemStats.totalGateways) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Gateways Table */}
      <div className="bg-background-secondary border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Gateways List</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">ID</th>
                <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">Location</th>
                <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">IP Address</th>
                <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">Connected Helmets</th>
                <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">Status</th>
                <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">Signal Strength</th>
                <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">Last Sync</th>
                <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockGateways.map((gateway) => (
                <tr key={gateway.id} className="border-b border-border/50 hover:bg-background transition-colors">
                  <td className="py-3 px-4 text-foreground font-medium">{gateway.id}</td>
                  <td className="py-3 px-4 text-foreground-secondary text-sm">{gateway.location}</td>
                  <td className="py-3 px-4 text-foreground-secondary text-sm font-mono text-xs">{gateway.ipAddress}</td>
                  <td className="py-3 px-4 text-foreground text-sm">{gateway.connectedHelmets}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {gateway.status === 'online' ? (
                        <>
                          <Wifi className="w-4 h-4 text-success" />
                          <span className="text-xs px-3 py-1 rounded-full font-medium bg-success/10 text-success">
                            Online
                          </span>
                        </>
                      ) : (
                        <>
                          <WifiOff className="w-4 h-4 text-critical" />
                          <span className="text-xs px-3 py-1 rounded-full font-medium bg-critical/10 text-critical">
                            Offline
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-foreground-secondary text-sm">{gateway.signalStrength} dBm</td>
                  <td className="py-3 px-4 text-foreground-secondary text-sm">
                    {new Date(gateway.lastSync).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-background rounded transition-colors" title="View">
                        <Eye className="w-4 h-4 text-info" />
                      </button>
                      <button className="p-2 hover:bg-background rounded transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4 text-primary" />
                      </button>
                      <button className="p-2 hover:bg-background rounded transition-colors" title="Delete">
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
    </div>
  );
}
