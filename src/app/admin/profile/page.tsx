'use client';

import { useState, useRef } from 'react';
import {
  Mail, Phone, MapPin, Calendar, Clock, Shield,
  Edit3, Building2, IdCard, Wifi, X, Camera, UserCheck,
  Eye, EyeOff, Lock, CheckCircle2,
} from 'lucide-react';

const initialProfile = {
  name:        'Admin User',
  initials:    'AU',
  role:        'System Administrator',
  email:       'admin@safehelm.io',
  phone:       '+250 788 999 000',
  location:    'SafeHelm HQ',
  department:  'IT Administration',
  employeeId:  'ADM-001',
  joinDate:    '2024-01-01',
  bio:         'System administrator responsible for managing the SafeHelm platform, overseeing supervisor accounts, worker registrations, gateway infrastructure, and ensuring system security compliance.',
};

/* ─── Change Password Drawer ──────────────────────────────── */
function ChangePasswordDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  const toggle = (field: keyof typeof show) => setShow(s => ({ ...s, [field]: !s[field] }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.next.length < 8) { setError('New password must be at least 8 characters.'); return; }
    if (form.next !== form.confirm) { setError('New passwords do not match.'); return; }
    setSuccess(true);
    setTimeout(() => { setSuccess(false); setForm({ current: '', next: '', confirm: '' }); onClose(); }, 1500);
  };

  const Field = ({
    id, label, value, visible, onToggle, onChange, placeholder,
  }: {
    id: string; label: string; value: string; visible: boolean;
    onToggle: () => void; onChange: (v: string) => void; placeholder: string;
  }) => (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label} <span className="text-critical">*</span></label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Lock className="w-4 h-4 text-foreground-tertiary" />
        </div>
        <input
          required
          type={visible ? 'text' : 'password'}
          value={value}
          placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          className="w-full pl-9 pr-10 py-2.5 text-sm bg-background border border-border rounded-lg
            text-foreground placeholder:text-foreground-tertiary
            focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
        />
        <button type="button" onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-tertiary hover:text-foreground transition-colors">
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 top-[69px] bg-black/20 z-40 backdrop-blur-[1px]" onClick={onClose} />
      <div className="fixed top-[69px] right-4 bottom-4 w-[420px] z-50 flex flex-col
        bg-background-secondary border border-border rounded-2xl shadow-2xl
        animate-in slide-in-from-right duration-300 ease-out">

        <div className="flex items-center justify-between px-6 py-5 border-b border-border flex-shrink-0">
          <div>
            <h2 className="text-base font-semibold text-foreground">Change Password</h2>
            <p className="text-xs text-foreground-tertiary mt-0.5">Choose a strong, unique password</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-background-tertiary rounded-lg transition-colors">
            <X className="w-4 h-4 text-foreground-secondary" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {success ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">Password Updated</p>
                <p className="text-sm text-foreground-secondary mt-1">Your password has been changed successfully.</p>
              </div>
            </div>
          ) : (
            <form id="change-admin-password-form" onSubmit={handleSubmit} className="space-y-5">
              <Field id="current" label="Current Password" value={form.current}
                visible={show.current} onToggle={() => toggle('current')}
                onChange={v => setForm(f => ({ ...f, current: v }))}
                placeholder="Enter your current password" />

              <div className="border-t border-border pt-5">
                <Field id="next" label="New Password" value={form.next}
                  visible={show.next} onToggle={() => toggle('next')}
                  onChange={v => setForm(f => ({ ...f, next: v }))}
                  placeholder="At least 8 characters" />

                {form.next.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1,2,3,4].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                          form.next.length >= i * 3
                            ? i <= 1 ? 'bg-critical' : i <= 2 ? 'bg-warning' : i <= 3 ? 'bg-primary' : 'bg-success'
                            : 'bg-background-tertiary'
                        }`} />
                      ))}
                    </div>
                    <p className="text-xs text-foreground-tertiary">
                      {form.next.length < 4 ? 'Weak' : form.next.length < 7 ? 'Fair' : form.next.length < 10 ? 'Good' : 'Strong'}
                    </p>
                  </div>
                )}
              </div>

              <Field id="confirm" label="Confirm New Password" value={form.confirm}
                visible={show.confirm} onToggle={() => toggle('confirm')}
                onChange={v => setForm(f => ({ ...f, confirm: v }))}
                placeholder="Repeat your new password" />

              {form.confirm.length > 0 && (
                <p className={`text-xs font-medium flex items-center gap-1.5 ${
                  form.next === form.confirm ? 'text-success' : 'text-critical'
                }`}>
                  {form.next === form.confirm
                    ? <><CheckCircle2 className="w-3.5 h-3.5" /> Passwords match</>
                    : '✗ Passwords do not match'}
                </p>
              )}

              {error && (
                <div className="px-3 py-2.5 rounded-lg bg-critical/10 border border-critical/20">
                  <p className="text-xs font-medium text-critical">{error}</p>
                </div>
              )}

              <div className="bg-background rounded-xl border border-border p-4 space-y-2">
                <p className="text-xs font-semibold text-foreground-secondary">Password requirements</p>
                {[
                  { text: 'At least 8 characters', met: form.next.length >= 8 },
                  { text: 'Contains a number',     met: /\d/.test(form.next) },
                  { text: 'Contains a letter',     met: /[a-zA-Z]/.test(form.next) },
                ].map(({ text, met }) => (
                  <p key={text} className={`text-xs flex items-center gap-2 ${met ? 'text-success' : 'text-foreground-tertiary'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${met ? 'bg-success' : 'bg-foreground-tertiary/40'}`} />
                    {text}
                  </p>
                ))}
              </div>
            </form>
          )}
        </div>

        {!success && (
          <div className="px-6 py-4 border-t border-border flex items-center gap-3 flex-shrink-0">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-foreground-secondary
                border border-border rounded-lg hover:bg-background-tertiary transition-colors">
              Cancel
            </button>
            <button type="submit" form="change-admin-password-form"
              className="flex-1 px-4 py-2.5 text-sm font-medium text-primary-foreground
                bg-primary rounded-lg hover:bg-primary-dark transition-colors">
              Update Password
            </button>
          </div>
        )}
      </div>
    </>
  );
}

/* ─── Edit Profile Drawer ─────────────────────────────────── */
interface EditProfileDrawerProps {
  open: boolean;
  profile: typeof initialProfile;
  avatarUrl: string | null;
  onAvatarChange: (url: string) => void;
  onSave: (p: typeof initialProfile) => void;
  onClose: () => void;
}

function EditProfileDrawer({ open, profile, avatarUrl, onAvatarChange, onSave, onClose }: EditProfileDrawerProps) {
  const [form, setForm] = useState({ ...profile });
  const fileRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onAvatarChange(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 top-[69px] bg-black/20 z-40 backdrop-blur-[1px]" onClick={onClose} />
      <div className="fixed top-[69px] right-4 bottom-4 w-[440px] z-50 flex flex-col
        bg-background-secondary border border-border rounded-2xl shadow-2xl
        animate-in slide-in-from-right duration-300 ease-out">

        <div className="flex items-center justify-between px-6 py-5 border-b border-border flex-shrink-0">
          <div>
            <h2 className="text-base font-semibold text-foreground">Edit Profile</h2>
            <p className="text-xs text-foreground-tertiary mt-0.5">Update your personal information</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-background-tertiary rounded-lg transition-colors">
            <X className="w-4 h-4 text-foreground-secondary" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <form id="edit-admin-profile-form" onSubmit={handleSubmit} className="space-y-5">

            {/* Avatar upload */}
            <div className="flex flex-col items-center gap-3 py-2">
              <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
                <div className="w-20 h-20 rounded-2xl bg-critical flex items-center justify-center
                  text-2xl font-bold text-white overflow-hidden">
                  {avatarUrl
                    ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                    : profile.initials}
                </div>
                <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center
                  opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </div>
              <button type="button" onClick={() => fileRef.current?.click()}
                className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors">
                Change Photo
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Full Name <span className="text-critical">*</span></label>
              <input required type="text" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Email <span className="text-critical">*</span></label>
              <input required type="email" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Phone</label>
              <input type="tel" value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Location</label>
              <input type="text" value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Department</label>
              <input type="text" value={form.department}
                onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Bio</label>
              <textarea rows={4} value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-border flex items-center gap-3 flex-shrink-0">
          <button type="button" onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-foreground-secondary
              border border-border rounded-lg hover:bg-background-tertiary transition-colors">
            Cancel
          </button>
          <button type="submit" form="edit-admin-profile-form"
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
export default function AdminProfilePage() {
  const [editOpen, setEditOpen]   = useState(false);
  const [pwOpen, setPwOpen]       = useState(false);
  const [profile, setProfile]     = useState(initialProfile);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const initials = profile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <>
      <div className="p-8 space-y-6">

        {/* ── Profile header card ── */}
        <div className="bg-background-secondary border border-border rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-critical flex items-center justify-center
              text-2xl font-bold text-white flex-shrink-0 overflow-hidden shadow-md">
              {avatarUrl
                ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                : initials}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-foreground">{profile.name}</h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                  bg-critical/10 text-critical text-xs font-semibold border border-critical/20">
                  <Shield className="w-3 h-3" />
                  Admin
                </span>
              </div>
              <p className="text-foreground-secondary text-sm mt-1">{profile.role} · {profile.department}</p>
              <p className="text-foreground-tertiary text-xs mt-1 flex items-center gap-1.5">
                <Mail className="w-3 h-3" />{profile.email}
              </p>
            </div>
          </div>
          <button onClick={() => setEditOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-primary
              text-primary-foreground rounded-xl hover:bg-primary-dark transition-colors shadow-sm self-start sm:self-auto flex-shrink-0">
            <Edit3 className="w-4 h-4" /> Edit Profile
          </button>
        </div>

        {/* ── Two-column info ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Personal Information */}
          <div className="bg-background-secondary border border-border rounded-2xl p-6">
            <h2 className="text-base font-semibold text-foreground mb-6">Personal Information</h2>
            <div className="space-y-4">
              {[
                { icon: IdCard,    label: 'Full Name',   value: profile.name },
                { icon: Mail,      label: 'Email',       value: profile.email },
                { icon: Phone,     label: 'Phone',       value: profile.phone },
                { icon: MapPin,    label: 'Location',    value: profile.location },
                { icon: Building2, label: 'Department',  value: profile.department },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-background border border-border flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-foreground-tertiary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-foreground-tertiary font-medium">{label}</p>
                    <p className="text-sm font-semibold text-foreground truncate">{value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-foreground-tertiary font-medium mb-2">Bio</p>
              <p className="text-sm text-foreground-secondary leading-relaxed">{profile.bio}</p>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-background-secondary border border-border rounded-2xl p-6 flex flex-col gap-6">
            <h2 className="text-base font-semibold text-foreground">Account Information</h2>

            <div className="space-y-4">
              {[
                { icon: Shield,     label: 'Admin ID',      value: profile.employeeId },
                { icon: UserCheck,  label: 'Role',          value: profile.role },
                { icon: Calendar,   label: 'Member Since',  value: new Date(profile.joinDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
                { icon: Clock,      label: 'Last Login',    value: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
                { icon: Wifi,       label: 'Access Level',  value: 'Full System Access' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-background border border-border flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-foreground-tertiary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-foreground-tertiary font-medium">{label}</p>
                    <p className="text-sm font-semibold text-foreground truncate">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* System Access */}
            <div className="mt-auto pt-6 border-t border-border">
              <p className="text-xs text-foreground-tertiary font-medium uppercase tracking-wider mb-3">System Access</p>
              <div className="space-y-2">
                {[
                  { label: 'Supervisor Management', desc: 'Create, edit, deactivate supervisors' },
                  { label: 'Worker Management',     desc: 'View all worker accounts' },
                  { label: 'Gateway Control',       desc: 'Manage all IoT gateways' },
                  { label: 'System Configuration',  desc: 'Full system settings access' },
                ].map(({ label, desc }) => (
                  <div key={label} className="flex items-center justify-between p-3 rounded-xl bg-background border border-border">
                    <div>
                      <p className="text-sm font-medium text-foreground">{label}</p>
                      <p className="text-xs text-foreground-tertiary">{desc}</p>
                    </div>
                    <Shield className="w-4 h-4 text-critical flex-shrink-0" />
                  </div>
                ))}
              </div>

              <div className="mt-3">
                <p className="text-xs text-foreground-tertiary font-medium uppercase tracking-wider mb-3">Security</p>
                <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border">
                  <div>
                    <p className="text-sm font-medium text-foreground">Password</p>
                    <p className="text-xs text-foreground-tertiary">Last changed 30 days ago</p>
                  </div>
                  <button onClick={() => setPwOpen(true)}
                    className="text-xs text-primary hover:text-primary-dark font-semibold transition-colors">
                    Change
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ChangePasswordDrawer open={pwOpen} onClose={() => setPwOpen(false)} />
      <EditProfileDrawer
        open={editOpen}
        profile={profile}
        avatarUrl={avatarUrl}
        onAvatarChange={setAvatarUrl}
        onSave={setProfile}
        onClose={() => setEditOpen(false)}
      />
    </>
  );
}
