'use client';

import { useState } from 'react';
import { mockHelmets } from '@/lib/mock-data';
import type { Helmet } from '@/lib/types';
import {
  Radio, Users, AlertTriangle, Zap, Plus, Eye, Edit2, Trash2,
  X, User, Wifi, Battery, Thermometer, Wind, Droplets,
  ShieldCheck, ShieldAlert, Activity, Clock, ChevronRight,
} from 'lucide-react';

/* ─── shared drawer shell ─────────────────────────────────── */

function Overlay({ onClick }: { onClick: () => void }) {
  return (
    <div
      className="fixed inset-0 top-[69px] bg-black/20 z-40 backdrop-blur-[1px]"
      onClick={onClick}
    />
  );
}

/* ─── Add Worker drawer (slides from right) ──────────────── */

interface AddWorkerDrawerProps {
  open: boolean;
  onClose: () => void;
}

function AddWorkerDrawer({ open, onClose }: AddWorkerDrawerProps) {
  const [form, setForm] = useState({
    name: '', workerId: '', role: '', phone: '', gateway: 'GW-001',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <Overlay onClick={onClose} />
      <div
        className="fixed top-[69px] right-4 bottom-4 w-[420px] z-50 flex flex-col
          bg-background-secondary border border-border rounded-2xl shadow-2xl
          animate-in slide-in-from-right duration-300 ease-out"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border flex-shrink-0">
          <div>
            <h2 className="text-base font-semibold text-foreground">Add New Worker</h2>
            <p className="text-xs text-foreground-tertiary mt-0.5">Register a worker & assign a helmet</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-background-tertiary rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-foreground-secondary" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <form id="add-worker-form" onSubmit={handleSubmit} className="space-y-5">
            {/* Worker Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Worker Name <span className="text-critical">*</span>
              </label>
              <input
                required
                type="text"
                placeholder="e.g. James Carter"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  placeholder:text-foreground-tertiary text-foreground
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
            </div>

            {/* Worker ID */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Worker ID</label>
              <input
                type="text"
                placeholder="Auto-generated (e.g. WRK-007)"
                value={form.workerId}
                onChange={e => setForm(f => ({ ...f, workerId: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  placeholder:text-foreground-tertiary text-foreground
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
              <p className="text-xs text-foreground-tertiary">Leave blank to auto-generate</p>
            </div>

            {/* Role / Department */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Role / Department <span className="text-critical">*</span>
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Mining Operations"
                value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  placeholder:text-foreground-tertiary text-foreground
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Phone Number</label>
              <input
                type="tel"
                placeholder="+250 7XX XXX XXX"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  placeholder:text-foreground-tertiary text-foreground
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
            </div>

            {/* Gateway */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Gateway Assignment <span className="text-critical">*</span>
              </label>
              <select
                required
                value={form.gateway}
                onChange={e => setForm(f => ({ ...f, gateway: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              >
                <option value="GW-001">GW-001 — Main Shaft</option>
                <option value="GW-002">GW-002 — Level 2</option>
                <option value="GW-003">GW-003 — Ventilation</option>
              </select>
            </div>

            {/* Helmet info box */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                  <Radio className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Helmet auto-assigned</p>
                  <p className="text-xs text-foreground-secondary mt-1">
                    A smart safety helmet will be automatically assigned to this worker from the
                    available stock in the selected gateway zone.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-foreground-secondary
              border border-border rounded-lg hover:bg-background-tertiary transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-worker-form"
            className="flex-1 px-4 py-2.5 text-sm font-medium text-primary-foreground
              bg-primary rounded-lg hover:bg-primary-dark transition-colors"
          >
            Add Worker
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── View Worker drawer (slides from left) ──────────────── */

interface ViewWorkerDrawerProps {
  helmet: Helmet | null;
  onClose: () => void;
  onEdit: (h: Helmet) => void;
}

function signalLabel(dbm: number) {
  if (dbm >= -50) return { label: 'Excellent', color: 'text-success' };
  if (dbm >= -65) return { label: 'Good', color: 'text-primary' };
  if (dbm >= -75) return { label: 'Fair', color: 'text-warning' };
  return { label: 'Weak', color: 'text-critical' };
}

function ViewWorkerDrawer({ helmet, onClose, onEdit }: ViewWorkerDrawerProps) {
  if (!helmet) return null;

  const sig = signalLabel(helmet.signalStrength);
  const initials = helmet.workerName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <>
      <Overlay onClick={onClose} />
      <div className="fixed top-[69px] right-4 bottom-4 w-[580px] z-50
        flex flex-col bg-background-secondary border border-border rounded-2xl shadow-2xl
        animate-in slide-in-from-right duration-300 ease-out">

        {/* Hero header */}
        <div className={`px-7 pt-7 pb-6 border-b border-border flex-shrink-0 rounded-t-2xl ${
          helmet.status === 'alarm' ? 'bg-critical/5' : 'bg-primary/5'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-5">
              {/* Avatar with initials */}
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0 ${
                helmet.status === 'alarm' ? 'bg-critical' : 'bg-primary'
              }`}>
                {initials}
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{helmet.workerName}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-xs text-foreground-tertiary bg-background px-2 py-0.5 rounded-md border border-border font-mono">
                    {helmet.workerId}
                  </span>
                  <span className="text-xs text-foreground-tertiary bg-background px-2 py-0.5 rounded-md border border-border font-mono">
                    {helmet.id}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                    helmet.status === 'active' ? 'bg-success/15 text-success' :
                    helmet.status === 'alarm'  ? 'bg-critical/15 text-critical' :
                    'bg-foreground-tertiary/10 text-foreground-tertiary'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      helmet.status === 'active' ? 'bg-success' :
                      helmet.status === 'alarm'  ? 'bg-critical animate-pulse' :
                      'bg-foreground-tertiary'
                    }`} />
                    {helmet.status === 'active' ? 'Active' : helmet.status === 'alarm' ? 'Alarm' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-background rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4 text-foreground-secondary" />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-7">

          {/* Live Sensor Readings */}
          <section>
            <h3 className="text-xs font-bold text-foreground-tertiary uppercase tracking-widest mb-4">
              Live Sensor Readings
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {/* CO */}
              <div className={`p-5 rounded-2xl border ${
                helmet.co > 40 ? 'border-critical/40 bg-critical/5' :
                helmet.co > 20 ? 'border-warning/40 bg-warning/5' :
                'border-border bg-background'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-foreground-secondary" />
                    <span className="text-xs font-semibold text-foreground-secondary">CO Level</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    helmet.co > 40 ? 'bg-critical/15 text-critical' :
                    helmet.co > 20 ? 'bg-warning/15 text-warning' :
                    'bg-success/15 text-success'
                  }`}>{helmet.co > 40 ? 'Critical' : helmet.co > 20 ? 'Warning' : 'Safe'}</span>
                </div>
                <p className={`text-4xl font-bold tracking-tight ${
                  helmet.co > 40 ? 'text-critical' : helmet.co > 20 ? 'text-warning' : 'text-foreground'
                }`}>{helmet.co}</p>
                <p className="text-xs text-foreground-tertiary mt-1">parts per million</p>
              </div>

              {/* CH4 */}
              <div className={`p-5 rounded-2xl border ${
                helmet.ch4 > 1.5 ? 'border-critical/40 bg-critical/5' :
                helmet.ch4 > 0.8 ? 'border-warning/40 bg-warning/5' :
                'border-border bg-background'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-foreground-secondary" />
                    <span className="text-xs font-semibold text-foreground-secondary">CH4 Level</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    helmet.ch4 > 1.5 ? 'bg-critical/15 text-critical' :
                    helmet.ch4 > 0.8 ? 'bg-warning/15 text-warning' :
                    'bg-success/15 text-success'
                  }`}>{helmet.ch4 > 1.5 ? 'Critical' : helmet.ch4 > 0.8 ? 'Warning' : 'Safe'}</span>
                </div>
                <p className={`text-4xl font-bold tracking-tight ${
                  helmet.ch4 > 1.5 ? 'text-critical' : helmet.ch4 > 0.8 ? 'text-warning' : 'text-foreground'
                }`}>{helmet.ch4.toFixed(2)}</p>
                <p className="text-xs text-foreground-tertiary mt-1">% methane</p>
              </div>

              {/* Temperature */}
              <div className={`p-5 rounded-2xl border ${
                helmet.temperature > 35 ? 'border-critical/40 bg-critical/5' :
                helmet.temperature > 30 ? 'border-warning/40 bg-warning/5' :
                'border-border bg-background'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-foreground-secondary" />
                    <span className="text-xs font-semibold text-foreground-secondary">Temperature</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    helmet.temperature > 35 ? 'bg-critical/15 text-critical' :
                    helmet.temperature > 30 ? 'bg-warning/15 text-warning' :
                    'bg-success/15 text-success'
                  }`}>{helmet.temperature > 35 ? 'High' : helmet.temperature > 30 ? 'Elevated' : 'Normal'}</span>
                </div>
                <p className={`text-4xl font-bold tracking-tight ${
                  helmet.temperature > 35 ? 'text-critical' : helmet.temperature > 30 ? 'text-warning' : 'text-foreground'
                }`}>{helmet.temperature}°</p>
                <p className="text-xs text-foreground-tertiary mt-1">Celsius</p>
              </div>

              {/* Humidity */}
              <div className={`p-5 rounded-2xl border ${
                helmet.humidity > 75 ? 'border-critical/40 bg-critical/5' :
                helmet.humidity > 60 ? 'border-warning/40 bg-warning/5' :
                'border-border bg-background'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-foreground-secondary" />
                    <span className="text-xs font-semibold text-foreground-secondary">Humidity</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    helmet.humidity > 75 ? 'bg-critical/15 text-critical' :
                    helmet.humidity > 60 ? 'bg-warning/15 text-warning' :
                    'bg-success/15 text-success'
                  }`}>{helmet.humidity > 75 ? 'High' : helmet.humidity > 60 ? 'Elevated' : 'Normal'}</span>
                </div>
                <p className={`text-4xl font-bold tracking-tight ${
                  helmet.humidity > 75 ? 'text-critical' : helmet.humidity > 60 ? 'text-warning' : 'text-foreground'
                }`}>{helmet.humidity}<span className="text-2xl">%</span></p>
                <p className="text-xs text-foreground-tertiary mt-1">relative humidity</p>
              </div>
            </div>
          </section>

          {/* Safety Status */}
          <section>
            <h3 className="text-xs font-bold text-foreground-tertiary uppercase tracking-widest mb-4">
              Safety Status
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-5 rounded-2xl border flex flex-col gap-3 ${
                helmet.helmetWear ? 'border-success/30 bg-success/5' : 'border-critical/30 bg-critical/5'
              }`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  helmet.helmetWear ? 'bg-success/15' : 'bg-critical/15'
                }`}>
                  {helmet.helmetWear
                    ? <ShieldCheck className="w-5 h-5 text-success" />
                    : <ShieldAlert className="w-5 h-5 text-critical" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Helmet Wear</p>
                  <p className={`text-xs font-bold mt-0.5 ${helmet.helmetWear ? 'text-success' : 'text-critical'}`}>
                    {helmet.helmetWear ? 'Wearing' : 'Not Wearing'}
                  </p>
                </div>
              </div>

              <div className={`p-5 rounded-2xl border flex flex-col gap-3 ${
                helmet.impactDetected ? 'border-critical/30 bg-critical/5' : 'border-border bg-background'
              }`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  helmet.impactDetected ? 'bg-critical/15' : 'bg-background-tertiary'
                }`}>
                  <AlertTriangle className={`w-5 h-5 ${helmet.impactDetected ? 'text-critical' : 'text-foreground-tertiary'}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Impact Detection</p>
                  <p className={`text-xs font-bold mt-0.5 ${helmet.impactDetected ? 'text-critical' : 'text-success'}`}>
                    {helmet.impactDetected ? 'Impact Detected!' : 'All Clear'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Device Info */}
          <section>
            <h3 className="text-xs font-bold text-foreground-tertiary uppercase tracking-widest mb-4">
              Device Information
            </h3>
            <div className="space-y-3">
              {/* Battery */}
              <div className="p-5 rounded-2xl border border-border bg-background">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Battery className="w-4 h-4 text-foreground-secondary" />
                    <span className="text-sm font-semibold text-foreground">Battery Level</span>
                  </div>
                  <span className={`text-lg font-bold ${
                    helmet.battery > 60 ? 'text-success' : helmet.battery > 30 ? 'text-warning' : 'text-critical'
                  }`}>{helmet.battery}%</span>
                </div>
                <div className="h-2.5 bg-background-tertiary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      helmet.battery > 60 ? 'bg-success' : helmet.battery > 30 ? 'bg-warning' : 'bg-critical'
                    }`}
                    style={{ width: `${helmet.battery}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl border border-border bg-background">
                  <Wifi className="w-4 h-4 text-foreground-secondary mb-2" />
                  <p className={`text-sm font-bold ${sig.color}`}>{sig.label}</p>
                  <p className="text-xs text-foreground-tertiary mt-0.5">{helmet.signalStrength} dBm</p>
                </div>
                <div className="p-4 rounded-2xl border border-border bg-background">
                  <Radio className="w-4 h-4 text-foreground-secondary mb-2" />
                  <p className="text-sm font-bold text-foreground">{helmet.gatewayId}</p>
                  <p className="text-xs text-foreground-tertiary mt-0.5">Gateway</p>
                </div>
                <div className="p-4 rounded-2xl border border-border bg-background">
                  <Clock className="w-4 h-4 text-foreground-secondary mb-2" />
                  <p className="text-sm font-bold text-foreground">
                    {new Date(helmet.lastUpdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-xs text-foreground-tertiary mt-0.5">Last update</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-7 py-5 border-t border-border flex items-center gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-foreground-secondary
              border border-border rounded-xl hover:bg-background-tertiary transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => { onClose(); onEdit(helmet); }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium
              text-primary-foreground bg-primary rounded-xl hover:bg-primary-dark transition-colors"
          >
            Edit Worker
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── Edit Worker drawer (slides from right) ─────────────── */

interface EditWorkerDrawerProps {
  helmet: Helmet | null;
  onClose: () => void;
}

function EditWorkerDrawer({ helmet, onClose }: EditWorkerDrawerProps) {
  if (!helmet) return null;

  const [form, setForm] = useState({
    name:     helmet.workerName,
    workerId: helmet.workerId,
    gateway:  helmet.gatewayId,
    status:   helmet.status as 'active' | 'inactive' | 'alarm',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <>
      <Overlay onClick={onClose} />
      <div className="fixed top-[69px] right-4 bottom-4 w-[420px] z-50 flex flex-col
        bg-background-secondary border border-border rounded-2xl shadow-2xl
        animate-in slide-in-from-right duration-300 ease-out">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border flex-shrink-0">
          <div>
            <h2 className="text-base font-semibold text-foreground">Edit Worker</h2>
            <p className="text-xs text-foreground-tertiary mt-0.5">{helmet.workerName} · {helmet.workerId}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-background-tertiary rounded-lg transition-colors">
            <X className="w-4 h-4 text-foreground-secondary" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <form id="edit-worker-form" onSubmit={handleSubmit} className="space-y-5">

            {/* Worker Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Worker Name <span className="text-critical">*</span></label>
              <input
                required type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
            </div>

            {/* Worker ID — read-only */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Worker ID</label>
              <input
                readOnly type="text"
                value={form.workerId}
                className="w-full px-3 py-2.5 text-sm bg-background-tertiary border border-border rounded-lg
                  text-foreground-secondary cursor-not-allowed"
              />
              <p className="text-xs text-foreground-tertiary">Worker ID cannot be changed</p>
            </div>

            {/* Helmet ID — read-only */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Helmet ID</label>
              <input
                readOnly type="text"
                value={helmet.id}
                className="w-full px-3 py-2.5 text-sm bg-background-tertiary border border-border rounded-lg
                  text-foreground-secondary cursor-not-allowed font-mono"
              />
            </div>

            {/* Gateway */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Gateway Assignment <span className="text-critical">*</span></label>
              <select
                required
                value={form.gateway}
                onChange={e => setForm(f => ({ ...f, gateway: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              >
                <option value="GW-001">GW-001 — Main Shaft</option>
                <option value="GW-002">GW-002 — Level 2</option>
                <option value="GW-003">GW-003 — Ventilation</option>
              </select>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Status</label>
              <div className="grid grid-cols-3 gap-2">
                {(['active', 'inactive', 'alarm'] as const).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, status: s }))}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                      form.status === s
                        ? s === 'active'   ? 'bg-success/10 border-success/40 text-success'
                        : s === 'alarm'    ? 'bg-critical/10 border-critical/40 text-critical'
                        :                   'bg-foreground-tertiary/10 border-foreground-tertiary/40 text-foreground-tertiary'
                        : 'bg-background border-border text-foreground-secondary hover:bg-background-tertiary'
                    }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center gap-3 flex-shrink-0">
          <button
            type="button" onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-foreground-secondary
              border border-border rounded-lg hover:bg-background-tertiary transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit" form="edit-worker-form"
            className="flex-1 px-4 py-2.5 text-sm font-medium text-primary-foreground
              bg-primary rounded-lg hover:bg-primary-dark transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── Main Page ───────────────────────────────────────────── */

export default function HelmetMonitoring() {
  const [addWorkerOpen, setAddWorkerOpen] = useState(false);
  const [viewHelmet, setViewHelmet]   = useState<Helmet | null>(null);
  const [editHelmet, setEditHelmet]   = useState<Helmet | null>(null);

  const activeHelmets  = mockHelmets.filter(h => h.status === 'active').length;
  const criticalHelmets = mockHelmets.filter(h => h.status === 'alarm').length;
  const avgBattery     = (mockHelmets.reduce((sum, h) => sum + h.battery, 0) / mockHelmets.length).toFixed(1);
  const wearingHelmet  = mockHelmets.filter(h => h.helmetWear).length;

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Real-time Helmet Monitoring</h2>
            <p className="text-foreground-secondary mt-1">Live sensor data from all active helmets</p>
          </div>
          <button
            onClick={() => setAddWorkerOpen(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Worker
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-background-secondary border border-border rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-foreground-secondary text-sm font-medium">Active Helmets</p>
                <p className="text-3xl font-bold text-foreground mt-2">{activeHelmets}</p>
                <p className="text-xs text-foreground-tertiary mt-2">of {mockHelmets.length} total</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-lg"><Radio className="w-6 h-6 text-primary" /></div>
            </div>
          </div>

          <div className="bg-background-secondary border border-border rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-foreground-secondary text-sm font-medium">Helmet Compliance</p>
                <p className="text-3xl font-bold text-foreground mt-2">{wearingHelmet}</p>
                <p className="text-xs text-foreground-tertiary mt-2">Workers wearing helmets</p>
              </div>
              <div className="bg-success/10 p-3 rounded-lg"><Users className="w-6 h-6 text-success" /></div>
            </div>
          </div>

          <div className="bg-background-secondary border border-border rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-foreground-secondary text-sm font-medium">Critical Status</p>
                <p className="text-3xl font-bold text-critical mt-2">{criticalHelmets}</p>
                <p className="text-xs text-foreground-tertiary mt-2">Requiring attention</p>
              </div>
              <div className="bg-critical/10 p-3 rounded-lg"><AlertTriangle className="w-6 h-6 text-critical" /></div>
            </div>
          </div>

          <div className="bg-background-secondary border border-border rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-foreground-secondary text-sm font-medium">Avg Battery</p>
                <p className="text-3xl font-bold text-foreground mt-2">{avgBattery}%</p>
                <p className="text-xs text-foreground-tertiary mt-2">Fleet average</p>
              </div>
              <div className="bg-warning/10 p-3 rounded-lg"><Zap className="w-6 h-6 text-warning" /></div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-background-secondary border border-border rounded-lg p-6 overflow-x-auto">
          <h3 className="text-lg font-semibold text-foreground mb-4">Helmet Details</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">Worker</th>
                <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">Status</th>
                <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">CO / CH4</th>
                <th className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">Temp / Humidity</th>
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
                      helmet.status === 'alarm'  ? 'bg-critical/10 text-critical' :
                      'bg-foreground-tertiary/10 text-foreground-tertiary'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        helmet.status === 'active' ? 'bg-success' :
                        helmet.status === 'alarm'  ? 'bg-critical' :
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
                      <button
                        onClick={() => setViewHelmet(helmet)}
                        className="p-1.5 hover:bg-background rounded transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4 text-primary" />
                      </button>
                      <button
                        onClick={() => setEditHelmet(helmet)}
                        className="p-1.5 hover:bg-background rounded transition-colors" title="Edit">
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

      <AddWorkerDrawer open={addWorkerOpen} onClose={() => setAddWorkerOpen(false)} />
      <ViewWorkerDrawer
        helmet={viewHelmet}
        onClose={() => setViewHelmet(null)}
        onEdit={h => { setViewHelmet(null); setEditHelmet(h); }}
      />
      <EditWorkerDrawer helmet={editHelmet} onClose={() => setEditHelmet(null)} />
    </>
  );
}
