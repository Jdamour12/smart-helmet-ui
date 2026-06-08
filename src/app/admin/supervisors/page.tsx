'use client';

import { useState, useEffect } from 'react';
import {
  Plus, Eye, Edit2, Trash2, X,
  Mail, MapPin, Users, Wifi,
  Calendar, Clock, ChevronRight, Shield,
} from 'lucide-react';
import { supervisors as supervisorsApi } from '@/lib/api';
import type { Supervisor } from '@/lib/api';

/* ─── Overlay ─────────────────────────────────────────────── */
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
  const [form, setForm] = useState({ name: '', email: '', location: '', phone: '', gateways: '1' });

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await supervisorsApi.create({ name: form.name, email: form.email, department: form.location });
    onClose();
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
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  text-foreground placeholder:text-foreground-tertiary
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Email Address <span className="text-critical">*</span></label>
              <input required type="email" placeholder="supervisor@mining.com"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  text-foreground placeholder:text-foreground-tertiary
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Zone / Location <span className="text-critical">*</span></label>
              <input required type="text" placeholder="e.g. North Shaft Operations"
                value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  text-foreground placeholder:text-foreground-tertiary
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Phone Number</label>
              <input type="tel" placeholder="+1-555-0100"
                value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  text-foreground placeholder:text-foreground-tertiary
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Gateways to Assign <span className="text-critical">*</span></label>
              <select required value={form.gateways}
                onChange={e => setForm(f => ({ ...f, gateways: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors">
                <option value="1">1 Gateway</option>
                <option value="2">2 Gateways</option>
                <option value="3">3 Gateways</option>
              </select>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Portal access auto-provisioned</p>
                  <p className="text-xs text-foreground-secondary mt-1">
                    Login credentials will be sent to the supervisor's email after account creation.
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
          <button type="submit" form="add-sup-form"
            className="flex-1 px-4 py-2.5 text-sm font-medium text-primary-foreground
              bg-primary rounded-lg hover:bg-primary-dark transition-colors">
            Add Supervisor
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

  const initials = (supervisor.name ?? '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <>
      <Overlay onClick={onClose} />
      <div className="fixed top-[69px] right-4 bottom-4 w-[540px] z-50 flex flex-col
        bg-background-secondary border border-border rounded-2xl shadow-2xl
        animate-in slide-in-from-right duration-300 ease-out">

        {/* Hero header */}
        <div className={`px-7 pt-7 pb-6 border-b border-border flex-shrink-0 rounded-t-2xl ${
          supervisor.status === 'active' ? 'bg-primary/5' : 'bg-warning/5'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-5">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0 ${
                supervisor.status === 'active' ? 'bg-primary' : 'bg-warning'
              }`}>{initials}</div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{supervisor.name}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-xs text-foreground-tertiary bg-background px-2 py-0.5 rounded-md border border-border font-mono">
                    {supervisor.id}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                    supervisor.status === 'active' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${supervisor.status === 'active' ? 'bg-success' : 'bg-warning'}`} />
                    {(supervisor.status ?? "inactive").charAt(0).toUpperCase() + (supervisor.status ?? "inactive").slice(1)}
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

          {/* Contact */}
          <section>
            <h3 className="text-xs font-bold text-foreground-tertiary uppercase tracking-widest mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-background">
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-foreground-tertiary font-medium">Email</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{supervisor.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-background">
                <div className="w-9 h-9 bg-info/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-info" />
                </div>
                <div>
                  <p className="text-xs text-foreground-tertiary font-medium">Zone / Location</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{supervisor.location}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Assignment Stats */}
          <section>
            <h3 className="text-xs font-bold text-foreground-tertiary uppercase tracking-widest mb-4">Assignments</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-border bg-background">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-foreground-secondary" />
                  <span className="text-xs font-semibold text-foreground-secondary">Workers</span>
                </div>
                <p className="text-4xl font-bold text-foreground">{supervisor.assignedWorkers}</p>
                <p className="text-xs text-foreground-tertiary mt-1">assigned workers</p>
              </div>
              <div className="p-5 rounded-2xl border border-border bg-background">
                <div className="flex items-center gap-2 mb-3">
                  <Wifi className="w-4 h-4 text-foreground-secondary" />
                  <span className="text-xs font-semibold text-foreground-secondary">Gateways</span>
                </div>
                <p className="text-4xl font-bold text-foreground">{supervisor.assignedGateways}</p>
                <p className="text-xs text-foreground-tertiary mt-1">assigned gateways</p>
              </div>
            </div>
          </section>

          {/* Account Info */}
          <section>
            <h3 className="text-xs font-bold text-foreground-tertiary uppercase tracking-widest mb-4">Account Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl border border-border bg-background">
                <Calendar className="w-4 h-4 text-foreground-secondary mb-2" />
                <p className="text-sm font-bold text-foreground">
                  {new Date(supervisor.joinDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="text-xs text-foreground-tertiary mt-0.5">Join date</p>
              </div>
              <div className="p-4 rounded-2xl border border-border bg-background">
                <Clock className="w-4 h-4 text-foreground-secondary mb-2" />
                <p className="text-sm font-bold text-foreground">
                  {new Date(supervisor.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-xs text-foreground-tertiary mt-0.5">Last active</p>
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

  const [form, setForm] = useState({
    name:     supervisor.name,
    email:    supervisor.email,
    location: supervisor.location,
    gateways: String(supervisor.assignedGateways),
    status:   supervisor.status as 'active' | 'inactive',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await supervisorsApi.update(supervisor.id, { name: form.name, email: form.email, department: form.location, status: form.status });
    onClose();
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
            <p className="text-xs text-foreground-tertiary mt-0.5">{supervisor.name} · {supervisor.id}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-background-tertiary rounded-lg transition-colors">
            <X className="w-4 h-4 text-foreground-secondary" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <form id="edit-sup-form" onSubmit={handleSubmit} className="space-y-5">

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Full Name <span className="text-critical">*</span></label>
              <input required type="text" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Email Address <span className="text-critical">*</span></label>
              <input required type="email" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Zone / Location <span className="text-critical">*</span></label>
              <input required type="text" value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Supervisor ID</label>
              <input readOnly value={supervisor.id}
                className="w-full px-3 py-2.5 text-sm bg-background-tertiary border border-border rounded-lg
                  text-foreground-secondary cursor-not-allowed font-mono" />
              <p className="text-xs text-foreground-tertiary">Supervisor ID cannot be changed</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Assigned Gateways</label>
              <select value={form.gateways}
                onChange={e => setForm(f => ({ ...f, gateways: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors">
                <option value="1">1 Gateway</option>
                <option value="2">2 Gateways</option>
                <option value="3">3 Gateways</option>
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
          <button type="submit" form="edit-sup-form"
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
export default function SupervisorsPage() {
  const [supList, setSupList]         = useState<Supervisor[]>([]);
  const [addOpen, setAddOpen]         = useState(false);
  const [viewSup, setViewSup]         = useState<Supervisor | null>(null);
  const [editSup, setEditSup]         = useState<Supervisor | null>(null);
  const [loading, setLoading]         = useState(true);

  const load = () => supervisorsApi.list().then(data => { setSupList(data); setLoading(false); });
  useEffect(() => { load(); }, []);

  const activeCount = supList.filter(s => s.status === 'active').length;

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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Supervisors',  value: supList.length, color: 'primary' },
            { label: 'Active Supervisors', value: activeCount,    color: 'success' },
            { label: 'Avg Workers',  value: supList.length ? Math.round(supList.reduce((a, s) => a + (s.worker_count ?? 0), 0) / supList.length) : 0, color: 'info' },
            { label: 'Avg Gateways', value: supList.length ? Math.round(supList.reduce((a, s) => a + (s.gateway_count ?? 0), 0) / supList.length) : 0, color: 'warning' },
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

        {/* Table */}
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Supervisors List</h3>
          {loading ? (
            <p className="text-foreground-secondary text-sm">Loading supervisors...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {['Name', 'Email', 'Department', 'Workers', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {supList.map(sup => (
                    <tr key={sup.id} className="border-b border-border/50 hover:bg-background transition-colors">
                      <td className="py-3 px-4 text-foreground font-medium">{sup.name}</td>
                      <td className="py-3 px-4 text-foreground-secondary text-sm">{sup.email}</td>
                      <td className="py-3 px-4 text-foreground-secondary text-sm">{sup.department}</td>
                      <td className="py-3 px-4 text-foreground text-sm">{sup.worker_count ?? 0}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                          sup.status === 'active' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                        }`}>{(sup.status ?? "inactive").charAt(0).toUpperCase() + (sup.status ?? "inactive").slice(1)}</span>
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
