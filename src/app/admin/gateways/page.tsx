'use client';

import { useState } from 'react';
import {
  Plus, Eye, Edit2, Trash2, Wifi, WifiOff,
  X, MapPin, Radio, Activity, Clock,
  Signal, Server, ChevronRight, CheckCircle, AlertCircle,
} from 'lucide-react';
import { mockGateways, adminSystemStats } from '@/lib/mock-data';
import type { Gateway } from '@/lib/types';

/* local extension with fields used in the UI */
const gateways = mockGateways.map((g, i) => ({
  ...g,
  ipAddress: `192.168.1.${10 + i}`,
}));
type GatewayEx = typeof gateways[number];

/* ─── Overlay ─────────────────────────────────────────────── */
function Overlay({ onClick }: { onClick: () => void }) {
  return (
    <div
      className="fixed inset-0 top-[69px] bg-black/20 z-40 backdrop-blur-[1px]"
      onClick={onClick}
    />
  );
}

/* ─── Add Gateway Drawer ──────────────────────────────────── */
function AddGatewayDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ gatewayId: '', location: '', ipAddress: '', zone: '', status: 'online' as 'online' | 'offline' });
  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onClose(); };

  return (
    <>
      <Overlay onClick={onClose} />
      <div className="fixed top-[69px] right-4 bottom-4 w-[420px] z-50 flex flex-col
        bg-background-secondary border border-border rounded-2xl shadow-2xl
        animate-in slide-in-from-right duration-300 ease-out">

        <div className="flex items-center justify-between px-6 py-5 border-b border-border flex-shrink-0">
          <div>
            <h2 className="text-base font-semibold text-foreground">Add New Gateway</h2>
            <p className="text-xs text-foreground-tertiary mt-0.5">Register a new IoT gateway device</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-background-tertiary rounded-lg transition-colors">
            <X className="w-4 h-4 text-foreground-secondary" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <form id="add-gateway-form" onSubmit={handleSubmit} className="space-y-5">

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Gateway ID</label>
              <input type="text" placeholder="Auto-generated (e.g. GW-004)"
                value={form.gatewayId} onChange={e => setForm(f => ({ ...f, gatewayId: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg font-mono
                  text-foreground placeholder:text-foreground-tertiary
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
              <p className="text-xs text-foreground-tertiary">Leave blank to auto-generate</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Location / Zone Name <span className="text-critical">*</span></label>
              <input required type="text" placeholder="e.g. West Tunnel"
                value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  text-foreground placeholder:text-foreground-tertiary
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">IP Address <span className="text-critical">*</span></label>
              <input required type="text" placeholder="e.g. 192.168.1.13"
                value={form.ipAddress} onChange={e => setForm(f => ({ ...f, ipAddress: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg font-mono
                  text-foreground placeholder:text-foreground-tertiary
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Mining Zone / Area</label>
              <input type="text" placeholder="e.g. Level 3 – Ventilation"
                value={form.zone} onChange={e => setForm(f => ({ ...f, zone: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  text-foreground placeholder:text-foreground-tertiary
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Initial Status</label>
              <div className="grid grid-cols-2 gap-2">
                {(['online', 'offline'] as const).map(s => (
                  <button key={s} type="button" onClick={() => setForm(f => ({ ...f, status: s }))}
                    className={`px-3 py-2.5 rounded-lg text-xs font-semibold border transition-colors flex items-center justify-center gap-2 ${
                      form.status === s
                        ? s === 'online'
                          ? 'bg-success/10 border-success/40 text-success'
                          : 'bg-critical/10 border-critical/40 text-critical'
                        : 'bg-background border-border text-foreground-secondary hover:bg-background-tertiary'
                    }`}>
                    {s === 'online' ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                  <Server className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Auto-configured on registration</p>
                  <p className="text-xs text-foreground-secondary mt-1">
                    The gateway will be discovered and configured automatically once it's powered on and connected to the network.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-border flex items-center gap-3 flex-shrink-0">
          <button type="button" onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-foreground-secondary
              border border-border rounded-lg hover:bg-background-tertiary transition-colors">
            Cancel
          </button>
          <button type="submit" form="add-gateway-form"
            className="flex-1 px-4 py-2.5 text-sm font-medium text-primary-foreground
              bg-primary rounded-lg hover:bg-primary-dark transition-colors">
            Add Gateway
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── View Gateway Drawer ─────────────────────────────────── */
function ViewGatewayDrawer({
  gateway, onClose, onEdit,
}: {
  gateway: GatewayEx | null;
  onClose: () => void;
  onEdit: (g: GatewayEx) => void;
}) {
  if (!gateway) return null;

  const signalBars = Math.round((gateway.signalStrength / 100) * 4);

  return (
    <>
      <Overlay onClick={onClose} />
      <div className="fixed top-[69px] right-4 bottom-4 w-[520px] z-50 flex flex-col
        bg-background-secondary border border-border rounded-2xl shadow-2xl
        animate-in slide-in-from-right duration-300 ease-out">

        {/* Hero header */}
        <div className={`px-7 pt-7 pb-6 border-b border-border flex-shrink-0 rounded-t-2xl ${
          gateway.status === 'online' ? 'bg-success/5' : 'bg-critical/5'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-5">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                gateway.status === 'online' ? 'bg-success/15' : 'bg-critical/15'
              }`}>
                {gateway.status === 'online'
                  ? <Wifi className="w-7 h-7 text-success" />
                  : <WifiOff className="w-7 h-7 text-critical" />}
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{gateway.id}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-xs text-foreground-tertiary bg-background px-2 py-0.5 rounded-md border border-border">
                    {gateway.location}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                    gateway.status === 'online'
                      ? 'bg-success/15 text-success'
                      : 'bg-critical/15 text-critical'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      gateway.status === 'online' ? 'bg-success animate-pulse' : 'bg-critical'
                    }`} />
                    {gateway.status.charAt(0).toUpperCase() + gateway.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-background rounded-lg transition-colors flex-shrink-0">
              <X className="w-4 h-4 text-foreground-secondary" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-7">

          {/* Key metrics */}
          <section>
            <h3 className="text-xs font-bold text-foreground-tertiary uppercase tracking-widest mb-4">
              Live Metrics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Signal */}
              <div className="p-5 rounded-2xl border border-border bg-background">
                <div className="flex items-center gap-2 mb-3">
                  <Signal className="w-4 h-4 text-foreground-secondary" />
                  <span className="text-xs font-semibold text-foreground-secondary">Signal Strength</span>
                </div>
                <p className={`text-4xl font-bold ${
                  gateway.signalStrength > 70 ? 'text-success' :
                  gateway.signalStrength > 40 ? 'text-warning' : 'text-critical'
                }`}>{gateway.signalStrength}<span className="text-xl">%</span></p>
                <div className="flex items-end gap-0.5 mt-2 h-4">
                  {[1,2,3,4].map(b => (
                    <div key={b} className={`w-2 rounded-sm ${
                      b <= signalBars
                        ? gateway.signalStrength > 70 ? 'bg-success' : gateway.signalStrength > 40 ? 'bg-warning' : 'bg-critical'
                        : 'bg-background-tertiary'
                    }`} style={{ height: `${b * 25}%` }} />
                  ))}
                </div>
              </div>

              {/* Connected helmets */}
              <div className="p-5 rounded-2xl border border-border bg-background">
                <div className="flex items-center gap-2 mb-3">
                  <Radio className="w-4 h-4 text-foreground-secondary" />
                  <span className="text-xs font-semibold text-foreground-secondary">Connected Helmets</span>
                </div>
                <p className="text-4xl font-bold text-foreground">{gateway.connectedHelmets}</p>
                <p className="text-xs text-foreground-tertiary mt-1">active devices</p>
              </div>
            </div>
          </section>

          {/* Network Info */}
          <section>
            <h3 className="text-xs font-bold text-foreground-tertiary uppercase tracking-widest mb-4">
              Network Information
            </h3>
            <div className="space-y-3">
              {[
                { icon: Server,  label: 'IP Address',   value: gateway.ipAddress, mono: true },
                { icon: MapPin,  label: 'Location',     value: gateway.location,  mono: false },
              ].map(({ icon: Icon, label, value, mono }) => (
                <div key={label} className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-background">
                  <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-foreground-tertiary font-medium">{label}</p>
                    <p className={`text-sm font-semibold text-foreground mt-0.5 ${mono ? 'font-mono' : ''}`}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Last heartbeat */}
          <section>
            <h3 className="text-xs font-bold text-foreground-tertiary uppercase tracking-widest mb-4">
              Status
            </h3>
            <div className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-background">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                gateway.status === 'online' ? 'bg-success/10' : 'bg-critical/10'
              }`}>
                {gateway.status === 'online'
                  ? <CheckCircle className="w-4 h-4 text-success" />
                  : <AlertCircle className="w-4 h-4 text-critical" />}
              </div>
              <div>
                <p className="text-xs text-foreground-tertiary font-medium">Last Heartbeat</p>
                <p className="text-sm font-semibold text-foreground mt-0.5">
                  {new Date(gateway.lastHeartbeat).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs text-foreground-tertiary font-medium">Gateway ID</p>
                <p className="text-sm font-semibold text-foreground font-mono">{gateway.id}</p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-7 py-5 border-t border-border flex items-center gap-3 flex-shrink-0">
          <button onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-foreground-secondary
              border border-border rounded-xl hover:bg-background-tertiary transition-colors">
            Close
          </button>
          <button onClick={() => { onClose(); onEdit(gateway); }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium
              text-primary-foreground bg-primary rounded-xl hover:bg-primary-dark transition-colors">
            Edit Gateway <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── Edit Gateway Drawer ─────────────────────────────────── */
function EditGatewayDrawer({ gateway, onClose }: { gateway: GatewayEx | null; onClose: () => void }) {
  if (!gateway) return null;

  const [form, setForm] = useState({
    location:  gateway.location,
    ipAddress: gateway.ipAddress,
    status:    gateway.status as 'online' | 'offline',
  });

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onClose(); };

  return (
    <>
      <Overlay onClick={onClose} />
      <div className="fixed top-[69px] right-4 bottom-4 w-[420px] z-50 flex flex-col
        bg-background-secondary border border-border rounded-2xl shadow-2xl
        animate-in slide-in-from-right duration-300 ease-out">

        <div className="flex items-center justify-between px-6 py-5 border-b border-border flex-shrink-0">
          <div>
            <h2 className="text-base font-semibold text-foreground">Edit Gateway</h2>
            <p className="text-xs text-foreground-tertiary mt-0.5">{gateway.id} · {gateway.location}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-background-tertiary rounded-lg transition-colors">
            <X className="w-4 h-4 text-foreground-secondary" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <form id="edit-gateway-form" onSubmit={handleSubmit} className="space-y-5">

            {/* Gateway ID — read-only */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Gateway ID</label>
              <input readOnly value={gateway.id}
                className="w-full px-3 py-2.5 text-sm bg-background-tertiary border border-border rounded-lg
                  text-foreground-secondary cursor-not-allowed font-mono" />
              <p className="text-xs text-foreground-tertiary">Gateway ID cannot be changed</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Location / Zone Name <span className="text-critical">*</span></label>
              <input required type="text" value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">IP Address <span className="text-critical">*</span></label>
              <input required type="text" value={form.ipAddress}
                onChange={e => setForm(f => ({ ...f, ipAddress: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg font-mono
                  text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Status</label>
              <div className="grid grid-cols-2 gap-2">
                {(['online', 'offline'] as const).map(s => (
                  <button key={s} type="button" onClick={() => setForm(f => ({ ...f, status: s }))}
                    className={`px-3 py-2.5 rounded-lg text-xs font-semibold border transition-colors flex items-center justify-center gap-2 ${
                      form.status === s
                        ? s === 'online'
                          ? 'bg-success/10 border-success/40 text-success'
                          : 'bg-critical/10 border-critical/40 text-critical'
                        : 'bg-background border-border text-foreground-secondary hover:bg-background-tertiary'
                    }`}>
                    {s === 'online' ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-border flex items-center gap-3 flex-shrink-0">
          <button type="button" onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-foreground-secondary
              border border-border rounded-lg hover:bg-background-tertiary transition-colors">
            Cancel
          </button>
          <button type="submit" form="edit-gateway-form"
            className="flex-1 px-4 py-2.5 text-sm font-medium text-primary-foreground
              bg-primary rounded-lg hover:bg-primary-dark transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── Main Page ───────────────────────────────────────────── */
export default function GatewaysPage() {
  const [addOpen, setAddOpen]     = useState(false);
  const [viewGw, setViewGw]       = useState<GatewayEx | null>(null);
  const [editGw, setEditGw]       = useState<GatewayEx | null>(null);

  const offlineCount = adminSystemStats.totalGateways - adminSystemStats.onlineGateways;
  const availRate    = Math.round((adminSystemStats.onlineGateways / adminSystemStats.totalGateways) * 100);

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Manage Gateways</h2>
            <p className="text-foreground-secondary mt-1">Monitor and configure network gateways</p>
          </div>
          <button onClick={() => setAddOpen(true)}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium
              hover:bg-primary-dark transition-colors flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add Gateway
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Gateways',    value: adminSystemStats.totalGateways,       color: 'primary',  sub: 'All devices' },
            { label: 'Online Gateways',   value: adminSystemStats.onlineGateways,      color: 'success',  sub: 'Fully operational' },
            { label: 'Offline Gateways',  value: offlineCount,                         color: 'critical', sub: 'Need attention' },
            { label: 'Availability Rate', value: `${availRate}%`,                      color: 'info',     sub: 'Network uptime' },
          ].map(({ label, value, color, sub }) => (
            <div key={label} className="bg-background-secondary border border-border rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-foreground-secondary text-sm font-medium">{label}</p>
                  <p className={`text-3xl font-bold text-${color} mt-2`}>{value}</p>
                  <p className={`text-xs mt-2 text-${color === 'primary' ? 'foreground-tertiary' : color}`}>{sub}</p>
                </div>
                <div className={`w-12 h-12 bg-${color}/10 rounded-lg flex items-center justify-center`}>
                  <span className={`text-base font-bold text-${color}`}>{value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Gateways List</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['ID', 'Location', 'IP Address', 'Helmets', 'Status', 'Signal', 'Last Heartbeat', 'Actions'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {gateways.map(gw => (
                  <tr key={gw.id} className="border-b border-border/50 hover:bg-background transition-colors">
                    <td className="py-3 px-4 text-foreground font-medium font-mono text-sm">{gw.id}</td>
                    <td className="py-3 px-4 text-foreground-secondary text-sm">{gw.location}</td>
                    <td className="py-3 px-4 text-foreground-secondary text-sm font-mono text-xs">{gw.ipAddress}</td>
                    <td className="py-3 px-4 text-foreground text-sm">{gw.connectedHelmets}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {gw.status === 'online'
                          ? <><Wifi className="w-4 h-4 text-success" /><span className="text-xs px-2.5 py-1 rounded-full font-medium bg-success/10 text-success">Online</span></>
                          : <><WifiOff className="w-4 h-4 text-critical" /><span className="text-xs px-2.5 py-1 rounded-full font-medium bg-critical/10 text-critical">Offline</span></>}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-end gap-0.5 h-4">
                          {[1,2,3,4].map(b => {
                            const bars = Math.round((gw.signalStrength / 100) * 4);
                            return (
                              <div key={b} className={`w-1.5 rounded-sm ${
                                b <= bars
                                  ? gw.signalStrength > 70 ? 'bg-success' : gw.signalStrength > 40 ? 'bg-warning' : 'bg-critical'
                                  : 'bg-background-tertiary'
                              }`} style={{ height: `${b * 25}%` }} />
                            );
                          })}
                        </div>
                        <span className="text-xs text-foreground-secondary">{gw.signalStrength}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-foreground-secondary text-sm">
                      {new Date(gw.lastHeartbeat).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setViewGw(gw)}
                          className="p-2 hover:bg-background rounded transition-colors" title="View">
                          <Eye className="w-4 h-4 text-info" />
                        </button>
                        <button onClick={() => setEditGw(gw)}
                          className="p-2 hover:bg-background rounded transition-colors" title="Edit">
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

      <AddGatewayDrawer open={addOpen} onClose={() => setAddOpen(false)} />
      <ViewGatewayDrawer
        gateway={viewGw}
        onClose={() => setViewGw(null)}
        onEdit={g => { setViewGw(null); setEditGw(g); }}
      />
      <EditGatewayDrawer gateway={editGw} onClose={() => setEditGw(null)} />
    </>
  );
}
