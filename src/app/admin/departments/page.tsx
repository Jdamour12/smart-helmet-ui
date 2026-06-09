'use client';

import { useState, useEffect } from 'react';
import {
  Plus, Eye, Edit2, Trash2, X,
  MapPin, Users, Building2, FileText,
  Calendar, ChevronRight, TrendingUp, AlertCircle,
} from 'lucide-react';
import {
  useDepartments, useCreateDepartment, useUpdateDepartment, useDeleteDepartment,
  useDepartmentWorkers,
} from '@/hooks/use-departments';
import type { Department, Worker } from '@/lib/types';

/* ─── Overlay ─────────────────────────────────────────────── */
function Overlay({ onClick }: { onClick: () => void }) {
  return (
    <div
      className="fixed inset-0 top-[69px] bg-black/20 z-40 backdrop-blur-[1px]"
      onClick={onClick}
    />
  );
}

/* ─── Add Department Drawer ───────────────────────────────── */
function AddDepartmentDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', location: '', description: '' });
  const { mutate: createDepartment, isPending } = useCreateDepartment();

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createDepartment(
      {
        name: form.name,
        location: form.location || undefined,
        description: form.description || undefined,
      },
      { onSuccess: () => { setForm({ name: '', location: '', description: '' }); onClose(); } },
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
            <h2 className="text-base font-semibold text-foreground">Add New Department</h2>
            <p className="text-xs text-foreground-tertiary mt-0.5">Create a department for worker organisation</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-background-tertiary rounded-lg transition-colors">
            <X className="w-4 h-4 text-foreground-secondary" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <form id="add-dept-form" onSubmit={handleSubmit} className="space-y-5">

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Department Name <span className="text-critical">*</span></label>
              <input required type="text" placeholder="e.g. Mining Operations"
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  text-foreground placeholder:text-foreground-tertiary
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Zone / Location</label>
              <input type="text" placeholder="e.g. North Shaft"
                value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  text-foreground placeholder:text-foreground-tertiary
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Description</label>
              <textarea rows={3} placeholder="Brief description of this department's role..."
                value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  text-foreground placeholder:text-foreground-tertiary resize-none
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                  <Building2 className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Workers can be assigned after creation</p>
                  <p className="text-xs text-foreground-secondary mt-1">
                    Assign workers to this department when creating or editing worker accounts.
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
          <button type="submit" form="add-dept-form" disabled={isPending}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-primary-foreground
              bg-primary rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60">
            {isPending ? 'Creating...' : 'Create Department'}
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── View Department Drawer ──────────────────────────────── */
function ViewDepartmentDrawer({
  department, onClose, onEdit,
}: {
  department: Department | null;
  onClose: () => void;
  onEdit: (d: Department) => void;
}) {
  const { data: workersRaw } = useDepartmentWorkers(department?.id ?? '');
  const workerList = (workersRaw as Worker[] | undefined) ?? [];

  if (!department) return null;

  const initials = department.name.slice(0, 2).toUpperCase();

  return (
    <>
      <Overlay onClick={onClose} />
      <div className="fixed top-[69px] right-4 bottom-4 w-[540px] z-50 flex flex-col
        bg-background-secondary border border-border rounded-2xl shadow-2xl
        animate-in slide-in-from-right duration-300 ease-out">

        {/* Hero header */}
        <div className={`px-7 pt-7 pb-6 border-b border-border flex-shrink-0 rounded-t-2xl ${
          department.is_active ? 'bg-primary/5' : 'bg-warning/5'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-5">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0 ${
                department.is_active ? 'bg-primary' : 'bg-warning'
              }`}>{initials}</div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{department.name}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                    department.is_active ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${department.is_active ? 'bg-success animate-pulse' : 'bg-warning'}`} />
                    {department.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-info/15 text-info">
                    {department.worker_count ?? workerList.length} workers
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

          {/* Details */}
          <section>
            <h3 className="text-xs font-bold text-foreground-tertiary uppercase tracking-widest mb-4">Details</h3>
            <div className="space-y-3">
              {department.location && (
                <div className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-background">
                  <div className="w-9 h-9 bg-info/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-info" />
                  </div>
                  <div>
                    <p className="text-xs text-foreground-tertiary font-medium">Zone / Location</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{department.location}</p>
                  </div>
                </div>
              )}
              {department.description && (
                <div className="flex items-start gap-4 p-4 rounded-2xl border border-border bg-background">
                  <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-foreground-tertiary font-medium">Description</p>
                    <p className="text-sm text-foreground mt-0.5 leading-relaxed">{department.description}</p>
                  </div>
                </div>
              )}
              {department.created_at && (
                <div className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-background">
                  <div className="w-9 h-9 bg-warning/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-warning" />
                  </div>
                  <div>
                    <p className="text-xs text-foreground-tertiary font-medium">Created</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">
                      {new Date(department.created_at).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Workers */}
          <section>
            <h3 className="text-xs font-bold text-foreground-tertiary uppercase tracking-widest mb-4">
              Workers ({workerList.length})
            </h3>
            {workerList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center rounded-2xl border border-border bg-background">
                <Users className="w-8 h-8 text-foreground-tertiary mb-2" />
                <p className="text-sm text-foreground-secondary">No workers assigned yet</p>
                <p className="text-xs text-foreground-tertiary mt-1">Assign workers from the worker creation form</p>
              </div>
            ) : (
              <div className="space-y-2">
                {workerList.map(w => {
                  const initials2 = (w.name ?? '?').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
                  return (
                    <div key={w.id} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${
                        w.status === 'active' ? 'bg-primary' : 'bg-warning'
                      }`}>{initials2}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{w.name}</p>
                        <p className="text-xs text-foreground-tertiary truncate">{w.email || '—'}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        w.status === 'active' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                      }`}>
                        {w.status ?? 'inactive'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="px-7 py-5 border-t border-border flex items-center gap-3 flex-shrink-0">
          <button onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-foreground-secondary
              border border-border rounded-xl hover:bg-background-tertiary transition-colors">
            Close
          </button>
          <button onClick={() => { onClose(); onEdit(department); }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium
              text-primary-foreground bg-primary rounded-xl hover:bg-primary-dark transition-colors">
            Edit Department <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── Edit Department Drawer ──────────────────────────────── */
function EditDepartmentDrawer({ department, onClose }: { department: Department | null; onClose: () => void }) {
  const { mutate: updateDepartment, isPending } = useUpdateDepartment();
  const [form, setForm] = useState({ name: '', location: '', description: '', is_active: true });

  useEffect(() => {
    if (department) {
      setForm({
        name: department.name,
        location: department.location ?? '',
        description: department.description ?? '',
        is_active: department.is_active,
      });
    }
  }, [department?.id]);

  if (!department) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateDepartment(
      {
        id: department.id,
        data: {
          name: form.name,
          location: form.location || undefined,
          description: form.description || undefined,
          is_active: form.is_active,
        },
      },
      { onSuccess: onClose },
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
            <h2 className="text-base font-semibold text-foreground">Edit Department</h2>
            <p className="text-xs text-foreground-tertiary mt-0.5">{department.name}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-background-tertiary rounded-lg transition-colors">
            <X className="w-4 h-4 text-foreground-secondary" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <form id="edit-dept-form" onSubmit={handleSubmit} className="space-y-5">

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Department Name <span className="text-critical">*</span></label>
              <input required type="text" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Zone / Location</label>
              <input type="text" placeholder="e.g. North Shaft" value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  text-foreground placeholder:text-foreground-tertiary
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Description</label>
              <textarea rows={3} placeholder="Brief description..." value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  text-foreground placeholder:text-foreground-tertiary resize-none
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Status</label>
              <select value={form.is_active ? 'active' : 'inactive'}
                onChange={e => setForm(f => ({ ...f, is_active: e.target.value === 'active' }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-border flex items-center gap-3 flex-shrink-0">
          <button type="button" onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-foreground-secondary
              border border-border rounded-lg hover:bg-background-tertiary transition-colors">
            Cancel
          </button>
          <button type="submit" form="edit-dept-form" disabled={isPending}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-primary-foreground
              bg-primary rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60">
            {isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── Main Page ───────────────────────────────────────────── */
export default function DepartmentsPage() {
  const [addOpen,   setAddOpen]   = useState(false);
  const [viewDept,  setViewDept]  = useState<Department | null>(null);
  const [editDept,  setEditDept]  = useState<Department | null>(null);

  const { data: deptsRaw, isLoading } = useDepartments();
  const { mutate: deleteDepartment } = useDeleteDepartment();

  const deptList = (deptsRaw as Department[] | undefined) ?? [];

  const activeDepts       = deptList.filter(d => d.is_active).length;
  const totalWorkers      = deptList.reduce((a, d) => a + (d.worker_count ?? 0), 0);
  const avgWorkers        = deptList.length ? Math.round(totalWorkers / deptList.length) : 0;
  const emptyDepts        = deptList.filter(d => (d.worker_count ?? 0) === 0).length;

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Departments</h2>
            <p className="text-foreground-secondary mt-1">Manage organisational departments and worker assignments</p>
          </div>
          <button onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg
              font-medium hover:bg-primary-dark transition-colors">
            <Plus className="w-5 h-5" /> Add Department
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Departments', value: deptList.length, sub: 'All departments',        color: 'primary', Icon: Building2 },
            { label: 'Active Departments', value: activeDepts,    sub: 'Currently active',        color: 'success', Icon: TrendingUp },
            { label: 'Total Workers',      value: totalWorkers,   sub: 'Across all departments',  color: 'info',    Icon: Users },
            { label: 'Unassigned Depts',   value: emptyDepts,     sub: 'No workers yet',          color: 'warning', Icon: AlertCircle },
          ].map(({ label, value, sub, color, Icon }) => (
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Departments List</h3>
            <span className="text-sm text-foreground-tertiary">{deptList.length} total</span>
          </div>

          {isLoading ? (
            <p className="text-foreground-secondary text-sm">Loading departments...</p>
          ) : deptList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <p className="text-foreground-secondary font-medium">No departments yet</p>
              <p className="text-foreground-tertiary text-sm mt-1">Click "Add Department" to create your first one.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {['Name', 'Location', 'Workers', 'Description', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {deptList.map(dept => (
                    <tr key={dept.id} className="border-b border-border/50 hover:bg-background transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white ${
                            dept.is_active ? 'bg-primary' : 'bg-foreground-tertiary'
                          }`}>
                            {dept.name.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="text-foreground font-medium text-sm">{dept.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-foreground-secondary text-sm">{dept.location || '—'}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-info" />
                          <span className="text-foreground text-sm font-medium">{dept.worker_count ?? 0}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-foreground-secondary text-sm max-w-[200px]">
                        <span className="truncate block">{dept.description || '—'}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          dept.is_active
                            ? 'bg-success/10 text-success'
                            : 'bg-warning/10 text-warning'
                        }`}>
                          {dept.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setViewDept(dept)}
                            className="p-2 hover:bg-background rounded transition-colors" title="View">
                            <Eye className="w-4 h-4 text-info" />
                          </button>
                          <button onClick={() => setEditDept(dept)}
                            className="p-2 hover:bg-background rounded transition-colors" title="Edit">
                            <Edit2 className="w-4 h-4 text-primary" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete department "${dept.name}"? Workers will be unassigned.`)) {
                                deleteDepartment(dept.id);
                              }
                            }}
                            className="p-2 hover:bg-background rounded transition-colors" title="Delete">
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

      <AddDepartmentDrawer open={addOpen} onClose={() => setAddOpen(false)} />
      <ViewDepartmentDrawer
        department={viewDept}
        onClose={() => setViewDept(null)}
        onEdit={d => { setViewDept(null); setEditDept(d); }}
      />
      <EditDepartmentDrawer department={editDept} onClose={() => setEditDept(null)} />
    </>
  );
}
