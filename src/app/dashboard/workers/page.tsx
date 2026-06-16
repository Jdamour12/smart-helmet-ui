'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Plus, Eye, Edit2, Trash2, X, Mail, Phone, Briefcase,
  Users, UserCheck, AlertCircle, HardHat,
} from 'lucide-react';
import { useWorkers, useCreateWorker, useUpdateWorker, useDeleteWorker } from '@/hooks/use-workers';
import { useHelmets, useCreateHelmet, useUpdateHelmet } from '@/hooks/use-helmets';
import { useDepartments } from '@/hooks/use-departments';
import { ConfirmDialog } from '@/components/confirm-dialog';
import type { Worker, Helmet, Department } from '@/lib/types';

function Overlay({ onClick }: { onClick: () => void }) {
  return <div className="fixed inset-0 top-[69px] bg-black/20 z-40 backdrop-blur-[1px]" onClick={onClick} />;
}

function AddWorkerDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [deptId, setDeptId]       = useState('');
  const [phone, setPhone]         = useState('');
  const [helmetId, setHelmetId]   = useState('');
  const [error, setError]         = useState('');

  const { mutateAsync: createWorkerAsync, isPending } = useCreateWorker();
  const { mutateAsync: createHelmetAsync }            = useCreateHelmet();
  const { mutateAsync: updateHelmetAsync }            = useUpdateHelmet();
  const { data: deptsRaw }                  = useDepartments();
  const { data: helmetsRaw }                = useHelmets();

  const deptList          = (deptsRaw   as Department[] | undefined) ?? [];
  const helmetList        = (helmetsRaw as Helmet[]     | undefined) ?? [];
  const unassignedHelmets = helmetList.filter(h => !h.worker_id);

  // Reset form when drawer opens
  useEffect(() => {
    if (open) { setName(''); setEmail(''); setDeptId(''); setPhone(''); setHelmetId(''); setError(''); }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Worker name is required.'); return; }
    setError('');

    const selectedDept = deptList.find(d => d.id === deptId);

    try {
      // supervisor_id is intentionally omitted — the backend auto-assigns
      // the current logged-in supervisor's own Supervisor.id.
      const newWorker: any = await createWorkerAsync({
        name:          name.trim(),
        email:         email.trim() || undefined,
        department:    selectedDept?.name,
        department_id: deptId || undefined,
        phone:         phone || undefined,
      } as any);

      if (helmetId) {
        try {
          await updateHelmetAsync({ id: helmetId, data: { worker_id: newWorker.id } });
        } catch {
          // continue even if helmet update fails
        }
      } else {
        try {
          await createHelmetAsync({ worker_id: newWorker.id } as any);
        } catch {
          // continue even if helmet create fails
        }
      }

      onClose();
      toast.success('Worker created successfully');
    } catch (err: any) {
      setError(err?.message ?? 'Failed to add worker. Please try again.');
      toast.error(err?.message ?? 'Failed to add worker. Please try again.');
    }
  };

  if (!open) return null;

  return (
    <>
      <Overlay onClick={onClose} />
      <div className="fixed top-[69px] right-4 bottom-4 w-[420px] z-50 flex flex-col bg-background-secondary border border-border rounded-2xl shadow-2xl animate-in slide-in-from-right duration-300 ease-out">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border flex-shrink-0">
          <div>
            <h2 className="text-base font-semibold text-foreground">Add New Worker</h2>
            <p className="text-xs text-foreground-tertiary mt-0.5">Register a worker & assign a helmet</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-background-tertiary rounded-lg transition-colors">
            <X className="w-4 h-4 text-foreground-secondary" />
          </button>
        </div>

        {/* Form — submit button is INSIDE the form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

            {error && (
              <div className="px-4 py-3 bg-critical/10 border border-critical/30 rounded-lg text-sm text-critical">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Worker Name <span className="text-critical">*</span>
              </label>
              <input
                required
                type="text"
                placeholder="e.g. James Carter"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-foreground-tertiary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Email Address</label>
              <input
                type="email"
                placeholder="worker@mining.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-foreground-tertiary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
              <p className="text-xs text-foreground-tertiary">Optional, but required for the worker to receive a login and the welcome email.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Department</label>
              <select
                value={deptId}
                onChange={e => setDeptId(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              >
                <option value="">No department</option>
                {deptList.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name}{d.location ? ` — ${d.location}` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Phone Number</label>
              <input
                type="tel"
                placeholder="+250 7XX XXX XXX"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-foreground-tertiary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Assign Helmet</label>
              <select
                value={helmetId}
                onChange={e => setHelmetId(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              >
                <option value="">Auto-assign new helmet</option>
                {unassignedHelmets.map(h => (
                  <option key={h.id} value={h.id}>{h.id}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer — submit is inside the form */}
          <div className="px-6 py-4 border-t border-border flex items-center gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-foreground-secondary border border-border rounded-lg hover:bg-background-tertiary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60"
            >
              {isPending ? 'Adding...' : 'Add Worker'}
            </button>
          </div>
        </form>

      </div>
    </>
  );
}

/* ─── View Worker Drawer ──────────────────────────────────── */
function ViewWorkerDrawer({
  worker, helmet, onClose, onEdit,
}: {
  worker: Worker | null;
  helmet: Helmet | undefined;
  onClose: () => void;
  onEdit: (w: Worker) => void;
}) {
  if (!worker) return null;
  const initials = (worker.name ?? '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <>
      <Overlay onClick={onClose} />
      <div className="fixed top-[69px] right-4 bottom-4 w-[540px] z-50 flex flex-col
        bg-background-secondary border border-border rounded-2xl shadow-2xl
        animate-in slide-in-from-right duration-300 ease-out">

        <div className={`px-7 pt-7 pb-6 border-b border-border flex-shrink-0 rounded-t-2xl ${
          worker.status === 'active' ? 'bg-primary/5' : 'bg-warning/5'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-5">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0 ${
                worker.status === 'active' ? 'bg-primary' : 'bg-warning'
              }`}>{initials}</div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{worker.name}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                    worker.status === 'active' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${worker.status === 'active' ? 'bg-success' : 'bg-warning'}`} />
                    {(worker.status ?? 'inactive').charAt(0).toUpperCase() + (worker.status ?? 'inactive').slice(1)}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-background rounded-lg transition-colors flex-shrink-0">
              <X className="w-4 h-4 text-foreground-secondary" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-7">
          <section>
            <h3 className="text-xs font-bold text-foreground-tertiary uppercase tracking-widest mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-background">
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-foreground-tertiary font-medium">Email</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{worker.email || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-background">
                <div className="w-9 h-9 bg-info/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-info" />
                </div>
                <div>
                  <p className="text-xs text-foreground-tertiary font-medium">Phone</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{worker.phone || '—'}</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold text-foreground-tertiary uppercase tracking-widest mb-4">Work Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-border bg-background">
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="w-4 h-4 text-foreground-secondary" />
                  <span className="text-xs font-semibold text-foreground-secondary">Department</span>
                </div>
                <p className="text-lg font-bold text-foreground">{worker.department || '—'}</p>
              </div>
              <div className="p-5 rounded-2xl border border-border bg-background">
                <div className="flex items-center gap-2 mb-3">
                  <HardHat className="w-4 h-4 text-foreground-secondary" />
                  <span className="text-xs font-semibold text-foreground-secondary">Helmet</span>
                </div>
                <p className="text-lg font-bold text-foreground font-mono">{helmet ? helmet.id : 'Unassigned'}</p>
              </div>
            </div>
          </section>
        </div>

        <div className="px-7 py-5 border-t border-border flex items-center gap-3 flex-shrink-0">
          <button onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-foreground-secondary
              border border-border rounded-xl hover:bg-background-tertiary transition-colors">
            Close
          </button>
          <button onClick={() => { onClose(); onEdit(worker); }}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-primary-foreground
              bg-primary rounded-xl hover:bg-primary-dark transition-colors">
            Edit Worker
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── Edit Worker Drawer (incl. helmet reassignment) ──────── */
function EditWorkerDrawer({
  worker, currentHelmet, unassignedHelmets, onClose,
}: {
  worker: Worker | null;
  currentHelmet: Helmet | undefined;
  unassignedHelmets: Helmet[];
  onClose: () => void;
}) {
  const { mutate: updateWorker, isPending: isSaving } = useUpdateWorker();
  const { mutate: updateHelmet } = useUpdateHelmet();
  const [form, setForm] = useState({ name: '', phone: '', department: '', status: 'active' as 'active' | 'inactive', helmetId: '' });

  useEffect(() => {
    if (worker) {
      setForm({
        name: worker.name ?? '',
        phone: worker.phone ?? '',
        department: worker.department ?? '',
        status: (worker.status ?? 'active') as 'active' | 'inactive',
        helmetId: currentHelmet?.id ?? '',
      });
    }
  }, [worker?.id, currentHelmet?.id]);

  if (!worker) return null;

  const selectableHelmets = currentHelmet ? [currentHelmet, ...unassignedHelmets] : unassignedHelmets;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateWorker(
      { id: worker.id, data: { name: form.name, phone: form.phone, department: form.department, status: form.status } },
      {
        onSuccess: () => {
          const helmetChanged = form.helmetId !== (currentHelmet?.id ?? '');
          if (helmetChanged) {
            if (currentHelmet) updateHelmet({ id: currentHelmet.id, data: { worker_id: '' } });
            if (form.helmetId) updateHelmet({ id: form.helmetId, data: { worker_id: worker.id } });
          }
          toast.success('Worker updated successfully');
          onClose();
        },
        onError: (err: any) => toast.error(err?.message ?? 'Failed to update worker'),
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
            <h2 className="text-base font-semibold text-foreground">Edit Worker</h2>
            <p className="text-xs text-foreground-tertiary mt-0.5">{worker.email || worker.name}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-background-tertiary rounded-lg transition-colors">
            <X className="w-4 h-4 text-foreground-secondary" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <form id="edit-worker-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <input required type="text" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Zone / Department</label>
              <input type="text" value={form.department}
                onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Phone Number</label>
              <input type="tel" value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Assigned Helmet</label>
              <select value={form.helmetId} onChange={e => setForm(f => ({ ...f, helmetId: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors">
                <option value="">Unassigned</option>
                {selectableHelmets.map(h => (
                  <option key={h.id} value={h.id}>{h.id}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Status</label>
              <div className="grid grid-cols-2 gap-2">
                {(['active', 'inactive'] as const).map(s => (
                  <button key={s} type="button" onClick={() => setForm(f => ({ ...f, status: s }))}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                      form.status === s
                        ? s === 'active'
                          ? 'bg-success/10 border-success/40 text-success'
                          : 'bg-warning/10 border-warning/40 text-warning'
                        : 'bg-background border-border text-foreground-secondary hover:bg-background-tertiary'
                    }`}>
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
          <button type="submit" form="edit-worker-form" disabled={isSaving}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-primary-foreground
              bg-primary rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60">
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </>
  );
}

export default function SupervisorWorkersPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [viewWorker, setViewWorker] = useState<Worker | null>(null);
  const [editWorker, setEditWorker] = useState<Worker | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Worker | null>(null);

  // The backend already scopes GET /workers to the logged-in supervisor's
  // own workers (see workers.py list_workers), so no client-side filtering
  // by supervisor_id is needed here.
  const { data: workersRaw, isLoading, isError, error } = useWorkers();
  const { data: helmetsRaw } = useHelmets();
  const { mutate: deleteWorker } = useDeleteWorker();

  const workerList = (workersRaw as Worker[] | undefined) ?? [];
  const helmetList = (helmetsRaw as Helmet[] | undefined) ?? [];
  const unassignedHelmets = helmetList.filter(h => !h.worker_id);

  const myWorkers     = workerList;
  const activeCount   = myWorkers.filter(w => w.status === 'active').length;
  const inactiveCount = myWorkers.length - activeCount;

  const getHelmet = (workerId: string) => helmetList.find(h => h.worker_id === workerId);

  const confirmDelete = () => {
    if (!deleteCandidate) return;
    deleteWorker(deleteCandidate.id, {
      onSuccess: () => toast.success('Worker removed successfully'),
      onError: (err: any) => toast.error(err?.message ?? 'Failed to remove worker'),
    });
    setDeleteCandidate(null);
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">My Workers</h2>
            <p className="text-foreground-secondary mt-1">Manage your assigned workers and their helmets</p>
          </div>
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            <Plus className="w-5 h-5" /> Add Worker
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Total Workers',    value: myWorkers.length, color: 'primary', sub: 'Under your supervision', Icon: Users },
            { label: 'Active Workers',   value: activeCount,      color: 'success', sub: 'Currently active',       Icon: UserCheck },
            { label: 'Inactive Workers', value: inactiveCount,    color: 'warning', sub: 'Need attention',         Icon: AlertCircle },
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
          <h3 className="text-lg font-semibold text-foreground mb-4">Workers List</h3>

          {isLoading ? (
            <p className="text-foreground-secondary text-sm">Loading workers...</p>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-critical/10 rounded-2xl flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-critical" />
              </div>
              <p className="text-foreground-secondary font-medium">Failed to load workers</p>
              <p className="text-foreground-tertiary text-sm mt-1">{(error as Error)?.message ?? 'Please try again'}</p>
            </div>
          ) : myWorkers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <HardHat className="w-8 h-8 text-primary" />
              </div>
              <p className="text-foreground-secondary font-medium">No workers yet</p>
              <p className="text-foreground-tertiary text-sm mt-1">Add your first worker to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {['Name', 'Email', 'Department', 'Phone', 'Helmet', 'Status', 'Actions'].map(col => (
                      <th key={col} className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {myWorkers.map(worker => {
                    const helmet = getHelmet(worker.id);
                    return (
                      <tr key={worker.id} className="border-b border-border/50 hover:bg-background transition-colors">
                        <td className="py-3 px-4 text-foreground font-medium">{worker.name}</td>
                        <td className="py-3 px-4 text-foreground-secondary text-sm">{worker.email || '—'}</td>
                        <td className="py-3 px-4 text-foreground-secondary text-sm">{worker.department || '—'}</td>
                        <td className="py-3 px-4 text-foreground-secondary text-sm">{worker.phone || '—'}</td>
                        <td className="py-3 px-4">
                          {helmet ? (
                            <span className="text-xs px-2 py-1 rounded-full font-medium bg-info/10 text-info font-mono">
                              {helmet.id}
                            </span>
                          ) : (
                            <span className="text-xs text-foreground-tertiary">Not assigned</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                            worker.status === 'active' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                          }`}>
                            {(worker.status ?? 'inactive').charAt(0).toUpperCase() + (worker.status ?? 'inactive').slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => setViewWorker(worker)} className="p-2 hover:bg-background rounded transition-colors" title="View">
                              <Eye className="w-4 h-4 text-info" />
                            </button>
                            <button onClick={() => setEditWorker(worker)} className="p-2 hover:bg-background rounded transition-colors" title="Edit">
                              <Edit2 className="w-4 h-4 text-primary" />
                            </button>
                            <button onClick={() => setDeleteCandidate(worker)} className="p-2 hover:bg-background rounded transition-colors" title="Delete">
                              <Trash2 className="w-4 h-4 text-critical" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <AddWorkerDrawer open={addOpen} onClose={() => setAddOpen(false)} />
      <ViewWorkerDrawer
        worker={viewWorker}
        helmet={viewWorker ? getHelmet(viewWorker.id) : undefined}
        onClose={() => setViewWorker(null)}
        onEdit={w => { setViewWorker(null); setEditWorker(w); }}
      />
      <EditWorkerDrawer
        worker={editWorker}
        currentHelmet={editWorker ? getHelmet(editWorker.id) : undefined}
        unassignedHelmets={unassignedHelmets}
        onClose={() => setEditWorker(null)}
      />
      <ConfirmDialog
        open={!!deleteCandidate}
        title="Delete worker"
        description={deleteCandidate ? `Are you sure you want to delete ${deleteCandidate.name}? This cannot be undone.` : undefined}
        confirmLabel="Yes"
        cancelLabel="No"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteCandidate(null)}
      />
    </>
  );
}
