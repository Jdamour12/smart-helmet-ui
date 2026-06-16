'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  Plus, Trash2, X, HardHat, Radio, CheckCircle2, AlertCircle,
} from 'lucide-react';
import { useHelmets, useCreateHelmet, useDeleteHelmet } from '@/hooks/use-helmets';
import { ConfirmDialog } from '@/components/confirm-dialog';
import type { Helmet } from '@/lib/types';

function Overlay({ onClick }: { onClick: () => void }) {
  return <div className="fixed inset-0 top-[69px] bg-black/20 z-40 backdrop-blur-[1px]" onClick={onClick} />;
}

function AddHelmetDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ helmet_code: '', zone: '', firmware_version: '' });
  const { mutate: createHelmet, isPending } = useCreateHelmet();

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createHelmet(
      {
        helmet_code: form.helmet_code.trim() || undefined,
        zone: form.zone.trim() || undefined,
        firmware_version: form.firmware_version.trim() || undefined,
      } as any,
      {
        onSuccess: () => {
          setForm({ helmet_code: '', zone: '', firmware_version: '' });
          onClose();
          toast.success('Helmet added successfully');
        },
        onError: (err: any) => toast.error(err?.message ?? 'Failed to add helmet'),
      },
    );
  };

  return (
    <>
      <Overlay onClick={onClose} />
      <div className="fixed top-[69px] right-4 bottom-4 w-[420px] z-50 flex flex-col
        bg-background-secondary border border-border rounded-2xl shadow-2xl
        animate-in slide-in-from-right duration-300 ease-out">

        <div className="flex items-center justify-between px-6 py-5 border-b border-border flex-shrink-0">
          <div>
            <h2 className="text-base font-semibold text-foreground">Add New Helmet</h2>
            <p className="text-xs text-foreground-tertiary mt-0.5">Register a helmet into inventory</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-background-tertiary rounded-lg transition-colors">
            <X className="w-4 h-4 text-foreground-secondary" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <form id="add-helmet-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Helmet Code</label>
              <input type="text" placeholder="e.g. HLM-001"
                value={form.helmet_code} onChange={e => setForm(f => ({ ...f, helmet_code: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  text-foreground placeholder:text-foreground-tertiary
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
              <p className="text-xs text-foreground-tertiary">Leave blank to auto-generate a code.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Zone</label>
              <input type="text" placeholder="e.g. North Shaft"
                value={form.zone} onChange={e => setForm(f => ({ ...f, zone: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  text-foreground placeholder:text-foreground-tertiary
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Firmware Version</label>
              <input type="text" placeholder="e.g. v1.2.0"
                value={form.firmware_version} onChange={e => setForm(f => ({ ...f, firmware_version: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  text-foreground placeholder:text-foreground-tertiary
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                  <HardHat className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Added to unassigned inventory</p>
                  <p className="text-xs text-foreground-secondary mt-1">
                    Supervisors can assign this helmet to a worker from their workers page.
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
          <button type="submit" form="add-helmet-form" disabled={isPending}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-primary-foreground
              bg-primary rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60">
            {isPending ? 'Adding...' : 'Add Helmet'}
          </button>
        </div>
      </div>
    </>
  );
}

export default function AdminHelmetsPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<Helmet | null>(null);

  const { data: helmetsRaw, isLoading, isError, error } = useHelmets();
  const { mutate: deleteHelmet } = useDeleteHelmet();

  const helmetList = (helmetsRaw as Helmet[] | undefined) ?? [];
  const assignedCount = helmetList.filter(h => h.worker_id).length;
  const unassignedCount = helmetList.length - assignedCount;

  const confirmDelete = () => {
    if (!deleteCandidate) return;
    deleteHelmet(deleteCandidate.id, {
      onSuccess: () => toast.success('Helmet removed successfully'),
      onError: (err: any) => toast.error(err?.message ?? 'Failed to remove helmet'),
    });
    setDeleteCandidate(null);
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Helmets</h2>
            <p className="text-foreground-secondary mt-1">Register helmets so supervisors can assign them to workers</p>
          </div>
          <button onClick={() => setAddOpen(true)}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add Helmet
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Total Helmets',      value: helmetList.length, color: 'primary', sub: 'In inventory',    Icon: Radio },
            { label: 'Assigned',           value: assignedCount,     color: 'success', sub: 'In use by a worker', Icon: CheckCircle2 },
            { label: 'Unassigned',         value: unassignedCount,   color: 'warning', sub: 'Available to assign', Icon: AlertCircle },
          ].map(({ label, value, color, sub, Icon }) => (
            <div key={label} className="bg-background-secondary border border-border rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-foreground-secondary text-sm font-medium">{label}</p>
                  <p className={`text-3xl font-bold text-${color} mt-2`}>{value}</p>
                  <p className="text-xs text-foreground-tertiary mt-2">{sub}</p>
                </div>
                <div className={`bg-${color}/10 p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 text-${color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Helmet Inventory</h3>
          {isLoading ? (
            <p className="text-foreground-secondary text-sm">Loading helmets...</p>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-critical/10 rounded-2xl flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-critical" />
              </div>
              <p className="text-foreground-secondary font-medium">Failed to load helmets</p>
              <p className="text-foreground-tertiary text-sm mt-1">{(error as Error)?.message ?? 'Please try again'}</p>
            </div>
          ) : helmetList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <HardHat className="w-8 h-8 text-primary" />
              </div>
              <p className="text-foreground-secondary font-medium">No helmets yet</p>
              <p className="text-foreground-tertiary text-sm mt-1">Add your first helmet to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {['Helmet Code', 'Zone', 'Status', 'Assigned To', 'Actions'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {helmetList.map(helmet => (
                    <tr key={helmet.id} className="border-b border-border/50 hover:bg-background transition-colors">
                      <td className="py-3 px-4 text-foreground font-medium font-mono text-sm">{helmet.helmet_code || helmet.id}</td>
                      <td className="py-3 px-4 text-foreground-secondary text-sm">{helmet.zone || '—'}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                          helmet.status === 'active' ? 'bg-success/10 text-success'
                            : helmet.status === 'alarm' ? 'bg-critical/10 text-critical'
                            : 'bg-foreground-tertiary/10 text-foreground-tertiary'
                        }`}>
                          {(helmet.status ?? 'inactive').charAt(0).toUpperCase() + (helmet.status ?? 'inactive').slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {helmet.worker_id ? (
                          <span className="text-foreground font-medium">{helmet.worker_name}</span>
                        ) : (
                          <span className="text-xs px-2 py-1 rounded-full font-medium bg-warning/10 text-warning">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <button onClick={() => setDeleteCandidate(helmet)} className="p-2 hover:bg-background rounded transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4 text-critical" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <AddHelmetDrawer open={addOpen} onClose={() => setAddOpen(false)} />
      <ConfirmDialog
        open={!!deleteCandidate}
        title="Delete helmet"
        description={deleteCandidate ? `Are you sure you want to delete helmet "${deleteCandidate.helmet_code || deleteCandidate.id}"? This cannot be undone.` : undefined}
        confirmLabel="Yes"
        cancelLabel="No"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteCandidate(null)}
      />
    </>
  );
}
