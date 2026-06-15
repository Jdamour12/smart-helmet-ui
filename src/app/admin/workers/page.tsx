'use client';

import { useState } from 'react';
import { Eye, X, Mail, Phone, Briefcase, Users, HardHat, UserCheck, AlertCircle, Wifi } from 'lucide-react';
import { useWorkers } from '@/hooks/use-workers';
import { useGateways } from '@/hooks/use-gateways';
import { useHelmets } from '@/hooks/use-helmets';
import type { Worker, Gateway, Helmet } from '@/lib/types';

/* ─── Overlay ─────────────────────────────────────────────── */
function Overlay({ onClick }: { onClick: () => void }) {
  return (
    <div
      className="fixed inset-0 top-[69px] bg-black/20 z-40 backdrop-blur-[1px]"
      onClick={onClick}
    />
  );
}

/* ─── View Worker Drawer ──────────────────────────────────── */
function ViewWorkerDrawer({ worker, gateways, onClose }: { worker: Worker | null; gateways: Gateway[]; onClose: () => void }) {
  if (!worker) return null;

  const initials = (worker.name ?? '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <>
      <Overlay onClick={onClose} />
      <div className="fixed top-[69px] right-4 bottom-4 w-[540px] z-50 flex flex-col
        bg-background-secondary border border-border rounded-2xl shadow-2xl
        animate-in slide-in-from-right duration-300 ease-out">

        {/* Hero header */}
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
                  <p className="text-sm font-semibold text-foreground mt-0.5">{worker.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-background">
                <div className="w-9 h-9 bg-info/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-info" />
                </div>
                <div>
                  <p className="text-xs text-foreground-tertiary font-medium">Phone</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{worker.phone}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Work Info */}
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
                  <span className="text-xs font-semibold text-foreground-secondary">Status</span>
                </div>
                <p className="text-lg font-bold text-foreground capitalize">{worker.status ?? 'inactive'}</p>
              </div>
            </div>

            {worker.supervisor_id && (
              <div className="mt-3 flex items-center gap-4 p-4 rounded-2xl border border-border bg-background">
                <div className="w-9 h-9 bg-success/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-success" />
                </div>
                <div>
                  <p className="text-xs text-foreground-tertiary font-medium">Supervisor ID</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5 font-mono">{worker.supervisor_id}</p>
                </div>
              </div>
            )}

            {worker.gateway_id && (() => {
              const gw = gateways.find(g => g.id === worker.gateway_id);
              const gwLabel = gw ? (gw.name || gw.location) : worker.gateway_id;
              return (
                <div className="mt-3 flex items-center gap-4 p-4 rounded-2xl border border-border bg-background">
                  <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Wifi className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-foreground-tertiary font-medium">Gateway</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{gwLabel}</p>
                  </div>
                </div>
              );
            })()}
          </section>
        </div>

        {/* Footer — read-only, close only */}
        <div className="px-7 py-5 border-t border-border flex-shrink-0">
          <button onClick={onClose}
            className="w-full px-4 py-2.5 text-sm font-medium text-foreground-secondary
              border border-border rounded-xl hover:bg-background-tertiary transition-colors">
            Close
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── Main Page ───────────────────────────────────────────── */
export default function WorkersPage() {
  const [viewWorker, setViewWorker] = useState<Worker | null>(null);
  const { data: workersRaw, isLoading } = useWorkers();
  const { data: gatewaysRaw } = useGateways();
  const { data: helmetsRaw }  = useHelmets();
  const workerList  = (workersRaw  as Worker[]  | undefined) ?? [];
  const gatewayList = (gatewaysRaw as Gateway[] | undefined) ?? [];
  const helmetList  = (helmetsRaw  as Helmet[]  | undefined) ?? [];

  const activeCount   = workerList.filter(w => w.status === 'active').length;
  const inactiveCount = workerList.length - activeCount;
  const activeHelmets = helmetList.filter(h => h.status === 'active').length;

  return (
    <>
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Workers</h2>
          <p className="text-foreground-secondary mt-1">View worker accounts and assignments</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Workers',    value: workerList.length, color: 'primary', sub: 'All accounts',     Icon: Users },
            { label: 'Active Workers',   value: activeCount,       color: 'success', sub: 'Currently active', Icon: UserCheck },
            { label: 'Inactive Workers', value: inactiveCount,     color: 'warning', sub: 'Need attention',   Icon: AlertCircle },
            { label: 'Active Helmets',   value: activeHelmets,     color: 'info',    sub: 'In use now',       Icon: HardHat },
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
          ) : workerList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <HardHat className="w-8 h-8 text-primary" />
              </div>
              <p className="text-foreground-secondary font-medium">No workers yet</p>
              <p className="text-foreground-tertiary text-sm mt-1">Workers will appear here once they are added</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {['Name', 'Email', 'Department', 'Status', 'Details'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {workerList.map(worker => (
                    <tr key={worker.id} className="border-b border-border/50 hover:bg-background transition-colors">
                      <td className="py-3 px-4 text-foreground font-medium">{worker.name}</td>
                      <td className="py-3 px-4 text-foreground-secondary text-sm">{worker.email}</td>
                      <td className="py-3 px-4 text-foreground-secondary text-sm">{worker.department}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                          worker.status === 'active' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                        }`}>{(worker.status ?? 'inactive').charAt(0).toUpperCase() + (worker.status ?? 'inactive').slice(1)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <button onClick={() => setViewWorker(worker)}
                          className="p-2 hover:bg-background rounded transition-colors" title="View details">
                          <Eye className="w-4 h-4 text-info" />
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

      <ViewWorkerDrawer worker={viewWorker} gateways={gatewayList} onClose={() => setViewWorker(null)} />
    </>
  );
}
