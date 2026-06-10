'use client';

import { useState, useEffect } from 'react';
import {
  Plus, Eye, Edit2, Trash2, X,
  Mail, Phone, BadgeCheck, Users, Shield, ChevronRight,
} from 'lucide-react';
import { supervisors as supervisorsApi } from '@/lib/api';
import type { Supervisor } from '@/lib/api';

function Overlay({ onClick }: { onClick: () => void }) {
  return (
    <div
      className="fixed inset-0 top-[69px] bg-black/20 z-40 backdrop-blur-[1px]"
      onClick={onClick}
    />
  );
}

/* ─── Add Supervisor Drawer ───────────────────────────────── */
function AddSupervisorDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm]   = useState({ full_name: '', employee_id: '', phone: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await supervisorsApi.create({
        full_name: form.full_name,
        employee_id: form.employee_id,
        phone: form.phone || undefined,
      } as Parameters<typeof supervisorsApi.create>[0]);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create supervisor');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Overlay onClick={onClose} />
      <div className="fixed top-[69px] right-4 bottom-4 w-[420px] z-50 flex flex-col
        bg-background-secondary border border-border rounded-2xl shadow-2xl
        animate-in slide-in-from-right duration-300 ease-out">

        <div className="flex items-center justify-between px-6 py-5 border-b border-border flex-shrink-0">
          <div>
            <h2 className="text-base font-semibold text-foreground">Add New Supervisor</h2>
            <p className="text-xs text-foreground-tertiary mt-0.5">Create a supervisor account</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-background-tertiary rounded-lg transition-colors">
            <X className="w-4 h-4 text-foreground-secondary" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <form id="add-sup-form" onSubmit={handleSubmit} className="space-y-5">

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Full Name <span className="text-critical">*</span></label>
              <input required type="text" placeholder="e.g. Robert Williams"
                value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  text-foreground placeholder:text-foreground-tertiary
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Employee ID <span className="text-critical">*</span></label>
              <input required type="text" placeholder="e.g. EMP-001"
                value={form.employee_id} onChange={e => setForm(f => ({ ...f, employee_id: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  text-foreground placeholder:text-foreground-tertiary
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Phone Number</label>
              <input type="tel" placeholder="+250-780-000-000"
                value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  text-foreground placeholder:text-foreground-tertiary
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <p className="text-xs text-foreground-secondary mt-1">
                  A user account can be linked to this supervisor profile from the user management section.
                </p>
              </div>
            </div>

            {error && <p className="text-xs text-critical bg-critical/10 px-3 py-2 rounded-lg">{error}</p>}
          </form>
        </div>

        <div className="px-6 py-4 border-t border-border flex items-center gap-3 flex-shrink-0">
          <button type="button" onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-foreground-secondary
              border border-border rounded-lg hover:bg-background-tertiary transition-colors">
            Cancel
          </button>
          <button type="submit" form="add-sup-form" disabled={saving}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-primary-foreground
              bg-primary rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50">
            {saving ? 'Adding…' : 'Add Supervisor'}
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── View Supervisor Drawer ──────────────────────────────── */
function ViewSupervisorDrawer({
  supervisor, onClose, onEdit,
}: {
  supervisor: Supervisor | null;
  onClose: () => void;
  onEdit: (s: Supervisor) => void;
}) {
  if (!supervisor) return null;

  const isActive = supervisor.is_active;
  const initials = (supervisor.full_name ?? '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <>
      <Overlay onClick={onClose} />
      <div className="fixed top-[69px] right-4 bottom-4 w-[540px] z-50 flex flex-col
        bg-background-secondary border border-border rounded-2xl shadow-2xl
        animate-in slide-in-from-right duration-300 ease-out">

        <div className={`px-7 pt-7 pb-6 border-b border-border flex-shrink-0 rounded-t-2xl ${
          isActive ? 'bg-primary/5' : 'bg-warning/5'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-5">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0 ${
                isActive ? 'bg-primary' : 'bg-warning'
              }`}>{initials}</div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{supervisor.full_name}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-xs text-foreground-tertiary bg-background px-2 py-0.5 rounded-md border border-border font-mono">
                    {supervisor.employee_id}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                    isActive ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-success' : 'bg-warning'}`} />
                    {isActive ? 'Active' : 'Inactive'}
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
              {supervisor.user?.email && (
                <div className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-background">
                  <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-foreground-tertiary font-medium">Email</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{supervisor.user.email}</p>
                  </div>
                </div>
              )}
              {supervisor.phone && (
                <div className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-background">
                  <div className="w-9 h-9 bg-info/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-info" />
                  </div>
                  <div>
                    <p className="text-xs text-foreground-tertiary font-medium">Phone</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{supervisor.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold text-foreground-tertiary uppercase tracking-widest mb-4">Account Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-border bg-background">
                <div className="flex items-center gap-2 mb-3">
                  <BadgeCheck className="w-4 h-4 text-foreground-secondary" />
                  <span className="text-xs font-semibold text-foreground-secondary">Employee ID</span>
                </div>
                <p className="text-lg font-bold text-foreground font-mono">{supervisor.employee_id}</p>
              </div>
              <div className="p-5 rounded-2xl border border-border bg-background">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-foreground-secondary" />
                  <span className="text-xs font-semibold text-foreground-secondary">Status</span>
                </div>
                <p className={`text-lg font-bold ${isActive ? 'text-success' : 'text-warning'}`}>
                  {isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
            {supervisor.user && (
              <div className="mt-3 flex items-center gap-4 p-4 rounded-2xl border border-border bg-background">
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-foreground-tertiary font-medium">Linked User</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{supervisor.user.full_name}</p>
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="px-7 py-5 border-t border-border flex items-center gap-3 flex-shrink-0">
          <button onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-foreground-secondary
              border border-border rounded-xl hover:bg-background-tertiary transition-colors">
            Close
          </button>
          <button onClick={() => { onClose(); onEdit(supervisor); }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium
              text-primary-foreground bg-primary rounded-xl hover:bg-primary-dark transition-colors">
            Edit Supervisor <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── Edit Supervisor Drawer ──────────────────────────────── */
function EditSupervisorDrawer({ supervisor, onClose }: { supervisor: Supervisor | null; onClose: () => void }) {
  if (!supervisor) return null;

  const [form, setForm]   = useState({
    full_name: supervisor.full_name ?? '',
    phone:     supervisor.phone ?? '',
    is_active: supervisor.is_active,
  });
  const [error, setError]   = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await supervisorsApi.update(supervisor.id, {
        full_name: form.full_name,
        phone:     form.phone || undefined,
        is_active: form.is_active,
      } as Parameters<typeof supervisorsApi.update>[1]);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Overlay onClick={onClose} />
      <div className="fixed top-[69px] right-4 bottom-4 w-[420px] z-50 flex flex-col
        bg-background-secondary border border-border rounded-2xl shadow-2xl
        animate-in slide-in-from-right duration-300 ease-out">

        <div className="flex items-center justify-between px-6 py-5 border-b border-border flex-shrink-0">
          <div>
            <h2 className="text-base font-semibold text-foreground">Edit Supervisor</h2>
            <p className="text-xs text-foreground-tertiary mt-0.5">{supervisor.full_name} · {supervisor.employee_id}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-background-tertiary rounded-lg transition-colors">
            <X className="w-4 h-4 text-foreground-secondary" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <form id="edit-sup-form" onSubmit={handleSubmit} className="space-y-5">

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Full Name <span className="text-critical">*</span></label>
              <input required type="text" value={form.full_name}
                onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
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
              <label className="text-sm font-medium text-foreground">Employee ID</label>
              <input readOnly value={supervisor.employee_id}
                className="w-full px-3 py-2.5 text-sm bg-background-tertiary border border-border rounded-lg
                  text-foreground-secondary cursor-not-allowed font-mono" />
              <p className="text-xs text-foreground-tertiary">Employee ID cannot be changed</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Status</label>
              <div className="grid grid-cols-2 gap-2">
                {([true, false] as const).map(val => (
                  <button key={String(val)} type="button" onClick={() => setForm(f => ({ ...f, is_active: val }))}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                      form.is_active === val
                        ? val
                          ? 'bg-success/10 border-success/40 text-success'
                          : 'bg-warning/10 border-warning/40 text-warning'
                        : 'bg-background border-border text-foreground-secondary hover:bg-background-tertiary'
                    }`}>
                    {val ? 'Active' : 'Inactive'}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-xs text-critical bg-critical/10 px-3 py-2 rounded-lg">{error}</p>}
          </form>
        </div>

        <div className="px-6 py-4 border-t border-border flex items-center gap-3 flex-shrink-0">
          <button type="button" onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-foreground-secondary
              border border-border rounded-lg hover:bg-background-tertiary transition-colors">
            Cancel
          </button>
          <button type="submit" form="edit-sup-form" disabled={saving}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-primary-foreground
              bg-primary rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── Main Page ───────────────────────────────────────────── */
export default function SupervisorsPage() {
  const [supList, setSupList] = useState<Supervisor[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [viewSup, setViewSup] = useState<Supervisor | null>(null);
  const [editSup, setEditSup] = useState<Supervisor | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => supervisorsApi.list().then(data => { setSupList(data); setLoading(false); });
  useEffect(() => { load(); }, []);

  const activeCount   = supList.filter(s => s.is_active).length;
  const inactiveCount = supList.length - activeCount;

  const handleDelete = async (id: string) => {
    await supervisorsApi.delete(id);
    load();
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Manage Supervisors</h2>
            <p className="text-foreground-secondary mt-1">View, edit, and manage supervisor accounts</p>
          </div>
          <button onClick={() => setAddOpen(true)}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add Supervisor
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Supervisors',    value: supList.length, color: 'primary' },
            { label: 'Active Supervisors',   value: activeCount,    color: 'success' },
            { label: 'Inactive Supervisors', value: inactiveCount,  color: 'warning' },
            { label: 'With User Account',    value: supList.filter(s => s.user_id).length, color: 'info' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-background-secondary border border-border rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-foreground-secondary text-sm font-medium">{label}</p>
                  <p className={`text-3xl font-bold text-${color} mt-2`}>{value}</p>
                </div>
                <div className={`w-12 h-12 bg-${color}/10 rounded-lg flex items-center justify-center`}>
                  <span className={`text-lg font-bold text-${color}`}>{value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Supervisors List</h3>
          {loading ? (
            <p className="text-foreground-secondary text-sm">Loading supervisors...</p>
          ) : supList.length === 0 ? (
            <p className="text-foreground-secondary text-sm">No supervisors found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {['Name', 'Employee ID', 'Email', 'Phone', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {supList.map(sup => (
                    <tr key={sup.id} className="border-b border-border/50 hover:bg-background transition-colors">
                      <td className="py-3 px-4 text-foreground font-medium">{sup.full_name}</td>
                      <td className="py-3 px-4 text-foreground-secondary text-sm font-mono">{sup.employee_id}</td>
                      <td className="py-3 px-4 text-foreground-secondary text-sm">{sup.user?.email ?? '—'}</td>
                      <td className="py-3 px-4 text-foreground-secondary text-sm">{sup.phone ?? '—'}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                          sup.is_active ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                        }`}>{sup.is_active ? 'Active' : 'Inactive'}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setViewSup(sup)} className="p-2 hover:bg-background rounded transition-colors" title="View">
                            <Eye className="w-4 h-4 text-info" />
                          </button>
                          <button onClick={() => setEditSup(sup)} className="p-2 hover:bg-background rounded transition-colors" title="Edit">
                            <Edit2 className="w-4 h-4 text-primary" />
                          </button>
                          <button onClick={() => handleDelete(sup.id)} className="p-2 hover:bg-background rounded transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4 text-critical" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <AddSupervisorDrawer open={addOpen} onClose={() => { setAddOpen(false); load(); }} />
      <ViewSupervisorDrawer
        supervisor={viewSup}
        onClose={() => setViewSup(null)}
        onEdit={s => { setViewSup(null); setEditSup(s); }}
      />
      <EditSupervisorDrawer supervisor={editSup} onClose={() => { setEditSup(null); load(); }} />
    </>
  );
}
