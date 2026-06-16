'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useHelmetsWithReadings, useHelmets, useCreateHelmet, useUpdateHelmet, useDeleteHelmet } from '@/hooks/use-helmets';
import { useCreateWorker } from '@/hooks/use-workers';
import { useDepartments } from '@/hooks/use-departments';
import { useHelmetLive } from '@/hooks/use-websocket-helmets';
import type { Helmet, Department } from '@/lib/types';
import {
  Radio, Users, AlertTriangle, Zap, Plus, Eye, Edit2, Trash2,
  X, Battery, Thermometer, Wind, Droplets,
  ShieldCheck, ShieldAlert, Activity, ChevronRight,
} from 'lucide-react';

function Overlay({ onClick }: { onClick: () => void }) {
  return <div className="fixed inset-0 top-[69px] bg-black/20 z-40 backdrop-blur-[1px]" onClick={onClick} />;
}

/* ─── Add Worker drawer ──────────────────────────────────── */
function AddWorkerDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', department_id: '', phone: '', helmet_id: '' });
  const { mutate: createWorker } = useCreateWorker();
  const { mutate: createHelmet } = useCreateHelmet();
  const { mutate: updateHelmet } = useUpdateHelmet();
  const { data: deptsRaw }   = useDepartments();
  const { data: helmetsRaw } = useHelmets();
  const deptList          = (deptsRaw   as Department[] | undefined) ?? [];
  const helmetList        = (helmetsRaw as Helmet[]     | undefined) ?? [];
  const unassignedHelmets = helmetList.filter(h => !h.worker_id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedDept = deptList.find(d => d.id === form.department_id);
    // supervisor_id is intentionally omitted — the backend auto-assigns
    // the current logged-in supervisor's own Supervisor.id (it does NOT
    // match the User.id stored in localStorage).
    createWorker(
      {
        name: form.name,
        email: form.email.trim() || undefined,
        department: selectedDept?.name,
        department_id: form.department_id || undefined,
        phone: form.phone,
      } as any,
      {
        onSuccess: (newWorker: any) => {
          const reset = () => {
            setForm({ name: '', email: '', department_id: '', phone: '', helmet_id: '' });
            onClose();
            toast.success('Worker created successfully');
          };
          if (form.helmet_id) {
            updateHelmet({ id: form.helmet_id, data: { worker_id: newWorker.id } }, { onSuccess: reset, onError: reset });
          } else {
            createHelmet({ worker_id: newWorker.id } as any, { onSuccess: reset, onError: reset });
          }
        },
        onError: (err: any) => {
          toast.error(err?.message ?? 'Failed to add worker. Please try again.');
        },
      },
    );
  };

  if (!open) return null;

  return (
    <>
      <Overlay onClick={onClose} />
      <div className="fixed top-[69px] right-4 bottom-4 w-[420px] z-50 flex flex-col bg-background-secondary border border-border rounded-2xl shadow-2xl animate-in slide-in-from-right duration-300 ease-out">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border flex-shrink-0">
          <div>
            <h2 className="text-base font-semibold text-foreground">Add New Worker</h2>
            <p className="text-xs text-foreground-tertiary mt-0.5">Register a worker & assign a helmet</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-background-tertiary rounded-lg transition-colors">
            <X className="w-4 h-4 text-foreground-secondary" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <form id="add-worker-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Worker Name <span className="text-critical">*</span></label>
              <input required type="text" placeholder="e.g. James Carter" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-foreground-tertiary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Email Address</label>
              <input type="email" placeholder="worker@mining.com" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-foreground-tertiary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
              <p className="text-xs text-foreground-tertiary">Optional, but required for the worker to receive a login and the welcome email.</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Department</label>
              <select value={form.department_id} onChange={e => setForm(f => ({ ...f, department_id: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors">
                <option value="">No department</option>
                {deptList.map(d => <option key={d.id} value={d.id}>{d.name}{d.location ? ` — ${d.location}` : ''}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Phone Number</label>
              <input type="tel" placeholder="+250 7XX XXX XXX" value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-foreground-tertiary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Assign Helmet</label>
              <select value={form.helmet_id} onChange={e => setForm(f => ({ ...f, helmet_id: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors">
                <option value="">Auto-assign new helmet</option>
                {unassignedHelmets.map(h => <option key={h.id} value={h.id}>{h.id}</option>)}
              </select>
            </div>
          </form>
        </div>
        <div className="px-6 py-4 border-t border-border flex items-center gap-3 flex-shrink-0">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-medium text-foreground-secondary border border-border rounded-lg hover:bg-background-tertiary transition-colors">Cancel</button>
          <button type="submit" form="add-worker-form" className="flex-1 px-4 py-2.5 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary-dark transition-colors">Add Worker</button>
        </div>
      </div>
    </>
  );
}

/* ─── View Worker drawer with live WebSocket data ────────── */
function ViewWorkerDrawer({ helmet, onClose, onEdit }: { helmet: Helmet | null; onClose: () => void; onEdit: (h: Helmet) => void }) {
  const live = useHelmetLive(helmet?.id ?? null);

  if (!helmet) return null;

  const co      = live?.co_ppm            ?? helmet.co          ?? 0;
  const ch4     = live?.ch4_percent       ?? helmet.ch4         ?? 0;
  const temp    = live?.temperature       ?? helmet.temperature ?? 0;
  const hum     = live?.humidity          ?? helmet.humidity    ?? 0;
  const worn    = live?.helmet_worn       ?? helmet.helmet_wear;
  const impact  = live?.vibration_detected ?? helmet.impact_detected;
  const battery = live?.battery_level     ?? helmet.battery     ?? 0;

  const reading = (live ?? helmet) as any;

  const initials = (helmet.worker_name ?? '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <>
      <Overlay onClick={onClose} />
      <div className="fixed top-[69px] right-4 bottom-4 w-[580px] z-50 flex flex-col bg-background-secondary border border-border rounded-2xl shadow-2xl animate-in slide-in-from-right duration-300 ease-out">
        <div className={`px-7 pt-7 pb-6 border-b border-border flex-shrink-0 rounded-t-2xl ${helmet.status === 'alarm' ? 'bg-critical/5' : 'bg-primary/5'}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-5">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0 ${helmet.status === 'alarm' ? 'bg-critical' : 'bg-primary'}`}>{initials}</div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{helmet.worker_name}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${helmet.status === 'active' ? 'bg-success/15 text-success' : helmet.status === 'alarm' ? 'bg-critical/15 text-critical' : 'bg-foreground-tertiary/10 text-foreground-tertiary'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${helmet.status === 'active' ? 'bg-success' : helmet.status === 'alarm' ? 'bg-critical animate-pulse' : 'bg-foreground-tertiary'}`} />
                    {helmet.status === 'active' ? 'Active' : helmet.status === 'alarm' ? 'Alarm' : 'Inactive'}
                  </span>
                  {live && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-success/15 text-success animate-pulse">● Live</span>}
                  {live?.ai_prediction && (
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      live.ai_prediction === 'danger' ? 'bg-critical/15 text-critical'
                        : live.ai_prediction === 'safe' ? 'bg-success/15 text-success'
                          : 'bg-foreground-tertiary/10 text-foreground-tertiary'
                    }`}>
                      AI: {live.ai_prediction === 'danger' ? 'DANGER'
                        : live.ai_prediction === 'safe' ? `Safe (${(live.ai_confidence ?? 0).toFixed(1)}%)`
                          : 'Loading...'}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-background rounded-lg transition-colors flex-shrink-0"><X className="w-4 h-4 text-foreground-secondary" /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-7">
          {/* Live Sensor Readings */}
          <section>
            <h3 className="text-xs font-bold text-foreground-tertiary uppercase tracking-widest mb-4">Live Sensor Readings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-5 rounded-2xl border ${co > 200 ? 'border-critical/40 bg-critical/5' : co > 50 ? 'border-warning/40 bg-warning/5' : 'border-border bg-background'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2"><Wind className="w-4 h-4 text-foreground-secondary" /><span className="text-xs font-semibold text-foreground-secondary">CO Level</span></div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${co > 200 ? 'bg-critical/15 text-critical' : co > 50 ? 'bg-warning/15 text-warning' : 'bg-success/15 text-success'}`}>{co > 200 ? 'Critical' : co > 50 ? 'Warning' : 'Safe'}</span>
                </div>
                <p className={`text-4xl font-bold tracking-tight ${co > 200 ? 'text-critical' : co > 50 ? 'text-warning' : 'text-foreground'}`}>{co.toFixed(1)}</p>
                <p className="text-xs text-foreground-tertiary mt-1">parts per million</p>
              </div>

              <div className={`p-5 rounded-2xl border ${ch4 > 2 ? 'border-critical/40 bg-critical/5' : ch4 > 1 ? 'border-warning/40 bg-warning/5' : 'border-border bg-background'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2"><Activity className="w-4 h-4 text-foreground-secondary" /><span className="text-xs font-semibold text-foreground-secondary">CH4 Level</span></div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ch4 > 2 ? 'bg-critical/15 text-critical' : ch4 > 1 ? 'bg-warning/15 text-warning' : 'bg-success/15 text-success'}`}>{ch4 > 2 ? 'Critical' : ch4 > 1 ? 'Warning' : 'Safe'}</span>
                </div>
                <p className={`text-4xl font-bold tracking-tight ${ch4 > 2 ? 'text-critical' : ch4 > 1 ? 'text-warning' : 'text-foreground'}`}>{ch4.toFixed(2)}</p>
                <p className="text-xs text-foreground-tertiary mt-1">% methane</p>
              </div>

              <div className={`p-5 rounded-2xl border ${temp > 55 ? 'border-critical/40 bg-critical/5' : temp > 40 ? 'border-warning/40 bg-warning/5' : 'border-border bg-background'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2"><Thermometer className="w-4 h-4 text-foreground-secondary" /><span className="text-xs font-semibold text-foreground-secondary">Temperature</span></div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${temp > 55 ? 'bg-critical/15 text-critical' : temp > 40 ? 'bg-warning/15 text-warning' : 'bg-success/15 text-success'}`}>{temp > 55 ? 'High' : temp > 40 ? 'Elevated' : 'Normal'}</span>
                </div>
                <p className={`text-4xl font-bold tracking-tight ${temp > 55 ? 'text-critical' : temp > 40 ? 'text-warning' : 'text-foreground'}`}>{temp.toFixed(1)}°</p>
                <p className="text-xs text-foreground-tertiary mt-1">Celsius</p>
              </div>

              <div className={`p-5 rounded-2xl border ${hum > 85 ? 'border-critical/40 bg-critical/5' : hum > 70 ? 'border-warning/40 bg-warning/5' : 'border-border bg-background'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2"><Droplets className="w-4 h-4 text-foreground-secondary" /><span className="text-xs font-semibold text-foreground-secondary">Humidity</span></div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${hum > 85 ? 'bg-critical/15 text-critical' : hum > 70 ? 'bg-warning/15 text-warning' : 'bg-success/15 text-success'}`}>{hum > 85 ? 'High' : hum > 70 ? 'Elevated' : 'Normal'}</span>
                </div>
                <p className={`text-4xl font-bold tracking-tight ${hum > 85 ? 'text-critical' : hum > 70 ? 'text-warning' : 'text-foreground'}`}>{hum.toFixed(1)}<span className="text-2xl">%</span></p>
                <p className="text-xs text-foreground-tertiary mt-1">relative humidity</p>
              </div>
            </div>
          </section>

          {/* AI Inference Results */}
          <section>
            <h3 className="text-sm font-semibold text-foreground-secondary uppercase tracking-wide">AI Safety Prediction</h3>

            <div className={`rounded-lg p-4 border ${
              reading?.ai_prediction === 'danger'
                ? 'bg-critical/5 border-critical/20'
                : reading?.ai_prediction === 'safe'
                ? 'bg-success/5 border-success/20'
                : 'bg-background-tertiary border-border'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Overall Prediction</span>
                <span className={`text-sm font-bold ${
                  reading?.ai_prediction === 'danger' ? 'text-critical' :
                  reading?.ai_prediction === 'safe' ? 'text-success' : 'text-foreground-tertiary'
                }`}>
                  {reading?.ai_prediction?.toUpperCase() ?? 'UNKNOWN'}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-foreground-tertiary">Confidence</span>
                <span className="text-xs text-foreground">{reading?.ai_confidence ?? 0}%</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-foreground-tertiary">Danger Votes</span>
                <span className="text-xs text-foreground">{reading?.ai_danger_votes ?? 0} / 4 models</span>
              </div>
            </div>

            {reading?.ai_model_votes && (
              <div className="grid grid-cols-2 gap-2 mt-3">
                {Object.entries({
                  'Isolation Forest': reading.ai_model_votes.isolation_forest,
                  'Random Forest':    reading.ai_model_votes.random_forest,
                  'LSTM':             reading.ai_model_votes.lstm,
                  'SVM':              reading.ai_model_votes.svm,
                }).map(([model, vote]) => (
                  <div key={model} className="bg-background rounded-lg p-3 border border-border">
                    <p className="text-xs text-foreground-tertiary">{model}</p>
                    <p className={`text-sm font-semibold mt-1 ${
                      vote === 'danger' ? 'text-critical' :
                      vote === 'safe'   ? 'text-success'  : 'text-foreground-tertiary'
                    }`}>
                      {vote?.toUpperCase() ?? '—'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Safety Status */}
          <section>
            <h3 className="text-xs font-bold text-foreground-tertiary uppercase tracking-widest mb-4">Safety Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-5 rounded-2xl border flex flex-col gap-3 ${worn ? 'border-success/30 bg-success/5' : 'border-critical/30 bg-critical/5'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${worn ? 'bg-success/15' : 'bg-critical/15'}`}>
                  {worn ? <ShieldCheck className="w-5 h-5 text-success" /> : <ShieldAlert className="w-5 h-5 text-critical" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Helmet Wear</p>
                  <p className={`text-xs font-bold mt-0.5 ${worn ? 'text-success' : 'text-critical'}`}>{worn ? 'Wearing' : 'Not Wearing'}</p>
                </div>
              </div>
              <div className={`p-5 rounded-2xl border flex flex-col gap-3 ${impact ? 'border-critical/30 bg-critical/5' : 'border-border bg-background'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${impact ? 'bg-critical/15' : 'bg-background-tertiary'}`}>
                  <AlertTriangle className={`w-5 h-5 ${impact ? 'text-critical' : 'text-foreground-tertiary'}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Impact Detection</p>
                  <p className={`text-xs font-bold mt-0.5 ${impact ? 'text-critical' : 'text-success'}`}>{impact ? 'Impact Detected!' : 'All Clear'}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Device Info */}
          <section>
            <h3 className="text-xs font-bold text-foreground-tertiary uppercase tracking-widest mb-4">Device Information</h3>
            <div className="p-5 rounded-2xl border border-border bg-background">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2"><Battery className="w-4 h-4 text-foreground-secondary" /><span className="text-sm font-semibold text-foreground">Battery Level</span></div>
                <span className={`text-lg font-bold ${battery > 60 ? 'text-success' : battery > 30 ? 'text-warning' : 'text-critical'}`}>{battery}%</span>
              </div>
              <div className="h-2.5 bg-background-tertiary rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${battery > 60 ? 'bg-success' : battery > 30 ? 'bg-warning' : 'bg-critical'}`} style={{ width: `${battery}%` }} />
              </div>
            </div>
          </section>
        </div>

        <div className="px-7 py-5 border-t border-border flex items-center gap-3 flex-shrink-0">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-medium text-foreground-secondary border border-border rounded-xl hover:bg-background-tertiary transition-colors">Close</button>
          <button onClick={() => { onClose(); onEdit(helmet); }} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-primary-foreground bg-primary rounded-xl hover:bg-primary-dark transition-colors">
            Edit Worker <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── Edit Worker drawer ─────────────────────────────────── */
function EditWorkerDrawer({ helmet, onClose }: { helmet: Helmet | null; onClose: () => void }) {
  const { mutate: updateHelmet } = useUpdateHelmet();
  const [form, setForm] = useState({
    status: (helmet?.status ?? 'inactive') as 'active' | 'inactive' | 'alarm',
  });

  useEffect(() => {
    if (helmet) {
      setForm({ status: helmet.status as 'active' | 'inactive' | 'alarm' });
    }
  }, [helmet?.id]);

  if (!helmet) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateHelmet(
      { id: helmet.id, data: { status: form.status } },
      { onSuccess: () => onClose() },
    );
  };

  return (
    <>
      <Overlay onClick={onClose} />
      <div className="fixed top-[69px] right-4 bottom-4 w-[420px] z-50 flex flex-col bg-background-secondary border border-border rounded-2xl shadow-2xl animate-in slide-in-from-right duration-300 ease-out">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border flex-shrink-0">
          <div>
            <h2 className="text-base font-semibold text-foreground">Edit Worker</h2>
            <p className="text-xs text-foreground-tertiary mt-0.5">{helmet.worker_name}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-background-tertiary rounded-lg transition-colors"><X className="w-4 h-4 text-foreground-secondary" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <form id="edit-worker-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Worker Name</label>
              <input readOnly value={helmet.worker_name} className="w-full px-3 py-2.5 text-sm bg-background-tertiary border border-border rounded-lg text-foreground-secondary cursor-not-allowed" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Status</label>
              <div className="grid grid-cols-3 gap-2">
                {(['active', 'inactive', 'alarm'] as const).map(s => (
                  <button key={s} type="button" onClick={() => setForm(f => ({ ...f, status: s }))}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${form.status === s ? s === 'active' ? 'bg-success/10 border-success/40 text-success' : s === 'alarm' ? 'bg-critical/10 border-critical/40 text-critical' : 'bg-foreground-tertiary/10 border-foreground-tertiary/40 text-foreground-tertiary' : 'bg-background border-border text-foreground-secondary hover:bg-background-tertiary'}`}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
        <div className="px-6 py-4 border-t border-border flex items-center gap-3 flex-shrink-0">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-medium text-foreground-secondary border border-border rounded-lg hover:bg-background-tertiary transition-colors">Cancel</button>
          <button type="submit" form="edit-worker-form" className="flex-1 px-4 py-2.5 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary-dark transition-colors">Save Changes</button>
        </div>
      </div>
    </>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function HelmetMonitoring() {
  const [addWorkerOpen, setAddWorkerOpen] = useState(false);
  const [viewHelmet, setViewHelmet]       = useState<Helmet | null>(null);
  const [editHelmet, setEditHelmet]       = useState<Helmet | null>(null);

  const { data: helmetsRaw, isLoading } = useHelmetsWithReadings();
  const { mutate: deleteHelmet }        = useDeleteHelmet();

  const helmetList = (helmetsRaw as Helmet[] | undefined) ?? [];

  const activeCount   = helmetList.filter(h => h.status === 'active').length;
  const criticalCount = helmetList.filter(h => h.status === 'alarm').length;
  const avgBattery    = helmetList.length ? (helmetList.reduce((s, h) => s + (h.battery ?? 0), 0) / helmetList.length).toFixed(1) : '0';
  const wearingCount  = helmetList.filter(h => h.helmet_wear).length;

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Real-time Helmet Monitoring</h2>
            <p className="text-foreground-secondary mt-1">Live sensor data from all active helmets</p>
          </div>
          <button onClick={() => setAddWorkerOpen(true)} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors font-medium">
            <Plus className="w-5 h-5" /> Add Worker
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Active Helmets',    value: activeCount,      sub: `of ${helmetList.length} total`, color: 'primary',  Icon: Radio },
            { label: 'Helmet Compliance', value: wearingCount,     sub: 'Workers wearing helmets',        color: 'success',  Icon: Users },
            { label: 'Critical Status',   value: criticalCount,    sub: 'Requiring attention',            color: 'critical', Icon: AlertTriangle },
            { label: 'Avg Battery',       value: `${avgBattery}%`, sub: 'Fleet average',                 color: 'warning',  Icon: Zap },
          ].map(({ label, value, sub, color, Icon }) => (
            <div key={label} className="bg-background-secondary border border-border rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-foreground-secondary text-sm font-medium">{label}</p>
                  <p className={`text-3xl font-bold text-${color} mt-2`}>{value}</p>
                  <p className="text-xs text-foreground-tertiary mt-2">{sub}</p>
                </div>
                <div className={`bg-${color}/10 p-3 rounded-lg`}><Icon className={`w-6 h-6 text-${color}`} /></div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6 overflow-x-auto">
          <h3 className="text-lg font-semibold text-foreground mb-4">Helmet Details</h3>
          {isLoading ? (
            <p className="text-foreground-secondary text-sm">Loading helmets...</p>
          ) : helmetList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <Radio className="w-8 h-8 text-primary" />
              </div>
              <p className="text-foreground-secondary font-medium">No helmets yet</p>
              <p className="text-foreground-tertiary text-sm mt-1">Assign helmets to workers to see monitoring data</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  {['Worker', 'Status', 'CO / CH4', 'Temp / Humidity', 'Helmet Wear', 'AI Prediction', 'Battery', 'Zone', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-foreground-secondary text-sm font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {helmetList.map((helmet) => (
                  <tr key={helmet.id} className="border-b border-border/50 hover:bg-background/50 transition-colors">
                    <td className="px-4 py-4 text-foreground text-sm font-medium">{helmet.worker_name || 'Unassigned'}</td>
                    <td className="px-4 py-4">
                      <span className={`text-xs px-2 py-1 rounded font-medium flex items-center gap-1 w-fit ${helmet.status === 'active' ? 'bg-success/10 text-success' : helmet.status === 'alarm' ? 'bg-critical/10 text-critical' : 'bg-foreground-tertiary/10 text-foreground-tertiary'}`}>
                        <span className={`w-2 h-2 rounded-full ${helmet.status === 'active' ? 'bg-success' : helmet.status === 'alarm' ? 'bg-critical' : 'bg-foreground-tertiary'}`} />
                        {(helmet.status ?? 'inactive').charAt(0).toUpperCase() + (helmet.status ?? 'inactive').slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-foreground text-sm">{(helmet.co ?? 0).toFixed(1)} ppm / {(helmet.ch4 ?? 0).toFixed(2)}%</td>
                    <td className="px-4 py-4 text-foreground text-sm">{(helmet.temperature ?? 0).toFixed(1)}°C / {(helmet.humidity ?? 0).toFixed(1)}%</td>
                    <td className="px-4 py-4">
                      <span className={`text-xs px-2 py-1 rounded font-medium ${helmet.helmet_wear ? 'bg-success/10 text-success' : 'bg-critical/10 text-critical'}`}>
                        {helmet.helmet_wear ? 'Yes' : 'No'}
                      </span>
                    </td>
                    
                    <td className="px-4 py-4">
                      <span className={`text-xs px-2 py-1 rounded font-medium ${helmet.ai_prediction === 'danger' ? 'bg-critical/10 text-critical' : helmet.ai_prediction === 'safe' ? 'bg-success/10 text-success' : 'bg-foreground-tertiary/10 text-foreground-tertiary'}`}>
                        {helmet.ai_prediction === 'danger' ? `DANGER (${helmet.ai_danger_votes ?? 0}/4)` : helmet.ai_prediction === 'safe' ? `Safe ${helmet.ai_confidence ? `(${helmet.ai_confidence}%)` : ''}` : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-16 bg-background rounded-full overflow-hidden">
                          <div className={`h-full ${(helmet.battery ?? 0) > 60 ? 'bg-success' : (helmet.battery ?? 0) > 30 ? 'bg-warning' : 'bg-critical'}`} style={{ width: `${helmet.battery ?? 0}%` }} />
                        </div>
                        <span className="text-xs text-foreground-secondary">{helmet.battery ?? 0}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-foreground text-sm">{helmet.est_zone ?? '-'}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setViewHelmet(helmet)} className="p-1.5 hover:bg-background rounded transition-colors" title="View"><Eye className="w-4 h-4 text-primary" /></button>
                        <button onClick={() => setEditHelmet(helmet)} className="p-1.5 hover:bg-background rounded transition-colors" title="Edit"><Edit2 className="w-4 h-4 text-warning" /></button>
                        <button onClick={() => deleteHelmet(helmet.id)} className="p-1.5 hover:bg-background rounded transition-colors" title="Delete"><Trash2 className="w-4 h-4 text-critical" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AddWorkerDrawer open={addWorkerOpen} onClose={() => setAddWorkerOpen(false)} />
      <ViewWorkerDrawer helmet={viewHelmet} onClose={() => setViewHelmet(null)} onEdit={h => { setViewHelmet(null); setEditHelmet(h); }} />
      <EditWorkerDrawer helmet={editHelmet} onClose={() => setEditHelmet(null)} />
    </>
  );
}
