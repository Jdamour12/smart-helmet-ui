'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Mail, Phone, MapPin, Clock, Shield,
  Edit3, Users, Building2, IdCard, Wifi, X, Camera,
  Eye, EyeOff, Lock, CheckCircle2,
} from 'lucide-react';
import { auth, resolveMediaUrl } from '@/lib/api';
import type { User } from '@/lib/api';

/* ─── helpers ─────────────────────────────────────────────── */
function persistUser(u: User) {
  localStorage.setItem('user', JSON.stringify(u));
  window.dispatchEvent(new Event('userUpdated'));
}

/* ─── Change Password Drawer ──────────────────────────────── */
function ChangePasswordDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm]       = useState({ current: '', next: '', confirm: '' });
  const [show, setShow]       = useState({ current: false, next: false, confirm: false });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState(false);
  const [saving, setSaving]   = useState(false);

  if (!open) return null;

  const toggle = (field: keyof typeof show) => setShow(s => ({ ...s, [field]: !s[field] }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.next.length < 8) { setError('New password must be at least 8 characters.'); return; }
    if (form.next !== form.confirm) { setError('New passwords do not match.'); return; }
    setSaving(true);
    try {
      await auth.changePassword(form.current, form.next);
      setSuccess(true);
      setTimeout(() => { setSuccess(false); setForm({ current: '', next: '', confirm: '' }); onClose(); }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const Field = ({ id, label, value, visible, onToggle, onChange, placeholder }: {
    id: string; label: string; value: string; visible: boolean;
    onToggle: () => void; onChange: (v: string) => void; placeholder: string;
  }) => (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label} <span className="text-critical">*</span></label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2"><Lock className="w-4 h-4 text-foreground-tertiary" /></div>
        <input required type={visible ? 'text' : 'password'} value={value} placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          className="w-full pl-9 pr-10 py-2.5 text-sm bg-background border border-border rounded-lg
            text-foreground placeholder:text-foreground-tertiary
            focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
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
            <form id="change-password-form" onSubmit={handleSubmit} className="space-y-5">
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
                <p className={`text-xs font-medium flex items-center gap-1.5 ${form.next === form.confirm ? 'text-success' : 'text-critical'}`}>
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
            <button type="submit" form="change-password-form" disabled={saving}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-primary-foreground
                bg-primary rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60">
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

/* ─── Edit Profile Drawer ─────────────────────────────────── */
function EditProfileDrawer({ open, user, onSave, onClose }: {
  open: boolean;
  user: User;
  onSave: (u: User) => void;
  onClose: () => void;
}) {
  const [form, setForm]     = useState({ ...user });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError]   = useState('');
  const fileRef             = useRef<HTMLInputElement>(null);

  useEffect(() => { setForm({ ...user }); }, [user]);

  if (!open) return null;

  const avatarSrc = resolveMediaUrl(form.avatar_url);
  const initials  = (form.full_name ?? '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await auth.uploadAvatar(file) as { avatar_url?: string; id?: string };
      const newUrl = res.avatar_url ?? null;
      const updated = { ...form, avatar_url: newUrl ?? form.avatar_url };
      setForm(updated);
      persistUser(updated);
      onSave(updated);
    } catch {
      // fallback to object URL for preview only
      setForm(f => ({ ...f, avatar_url: URL.createObjectURL(file) }));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      // Backend only accepts full_name and email — send those
      const updated = await auth.updateMe({
        full_name: form.full_name,
        email: form.email,
      } as Parameters<typeof auth.updateMe>[0]) as User;

      // Merge backend response with local-only fields
      const merged: User = {
        ...updated,
        phone:      form.phone,
        location:   form.location,
        department: form.department,
        bio:        form.bio,
        avatar_url: form.avatar_url ?? updated.avatar_url,
      };

      persistUser(merged);
      onSave(merged);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setSaving(false);
    }
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
          <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-5">

            {/* Avatar upload */}
            <div className="flex flex-col items-center gap-3 py-2">
              <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
                <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center
                  text-2xl font-bold text-white overflow-hidden">
                  {avatarSrc
                    ? <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
                    : initials}
                </div>
                <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center
                  opacity-0 group-hover:opacity-100 transition-opacity">
                  {uploading
                    ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <Camera className="w-5 h-5 text-white" />}
                </div>
              </div>
              <button type="button" onClick={() => fileRef.current?.click()}
                className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors">
                {uploading ? 'Uploading...' : 'Change Photo'}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </div>

            {/* Fields */}
            {[
              { label: 'Full Name',       key: 'full_name',   type: 'text',  required: true },
              { label: 'Email',           key: 'email',       type: 'email', required: true },
              { label: 'Phone',           key: 'phone',       type: 'tel',   required: false },
              { label: 'Zone / Location', key: 'location',    type: 'text',  required: false },
              { label: 'Department',      key: 'department',  type: 'text',  required: false },
            ].map(({ label, key, type, required }) => (
              <div key={key} className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  {label} {required && <span className="text-critical">*</span>}
                </label>
                <input required={required} type={type}
                  value={(form as Record<string, string | undefined>)[key] ?? ''}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                    text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
              </div>
            ))}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Bio</label>
              <textarea rows={3} value={form.bio ?? ''}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
                  text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>

            {error && (
              <div className="px-3 py-2.5 rounded-lg bg-critical/10 border border-critical/20">
                <p className="text-xs font-medium text-critical">{error}</p>
              </div>
            )}
          </form>
        </div>

        <div className="px-6 py-4 border-t border-border flex items-center gap-3 flex-shrink-0">
          <button type="button" onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-foreground-secondary
              border border-border rounded-lg hover:bg-background-tertiary transition-colors">
            Cancel
          </button>
          <button type="submit" form="edit-profile-form" disabled={saving}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-primary-foreground
              bg-primary rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── Main Page ───────────────────────────────────────────── */
export default function ProfilePage() {
  const [user, setUser]       = useState<User | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [pwOpen, setPwOpen]   = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from backend; merge with any locally-stored extra fields
    const stored = localStorage.getItem('user');
    const local: Partial<User> = stored ? JSON.parse(stored) : {};

    auth.me().then(u => {
      const userData = u as User;
      const merged: User = {
        ...userData,
        phone:      local.phone,
        location:   local.location,
        department: local.department,
        bio:        local.bio,
        avatar_url: userData.avatar_url ?? local.avatar_url,
      };
      setUser(merged);
      persistUser(merged);
    }).catch(() => {
      if (local.id) setUser(local as User);
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = (updated: User) => { setUser(updated); };

  if (loading || !user) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <p className="text-foreground-secondary">Loading profile...</p>
      </div>
    );
  }

  const initials  = (user.full_name ?? '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const avatarSrc = resolveMediaUrl(user.avatar_url);

  return (
    <>
      <div className="p-8 space-y-6">
        {/* Profile header card */}
        <div className="bg-background-secondary border border-border rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center
              text-2xl font-bold text-white flex-shrink-0 overflow-hidden shadow-md">
              {avatarSrc
                ? <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
                : initials}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-foreground">{user.full_name}</h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                  bg-success/10 text-success text-xs font-semibold border border-success/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  Active
                </span>
              </div>
              <p className="text-foreground-secondary text-sm mt-1">
                {user.role === 'supervisor' ? 'Supervisor' : 'Administrator'}{user.department ? ` · ${user.department}` : ''}
              </p>
              <p className="text-foreground-tertiary text-xs mt-1 flex items-center gap-1.5">
                <Mail className="w-3 h-3" />{user.email}
              </p>
            </div>
          </div>
          <button onClick={() => setEditOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-primary
              text-primary-foreground rounded-xl hover:bg-primary-dark transition-colors shadow-sm self-start sm:self-auto flex-shrink-0">
            <Edit3 className="w-4 h-4" /> Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal info */}
          <div className="bg-background-secondary border border-border rounded-2xl p-6">
            <h2 className="text-base font-semibold text-foreground mb-6">Personal Information</h2>
            <div className="space-y-4">
              {[
                { icon: IdCard,    label: 'Full Name',  value: user.full_name },
                { icon: Mail,      label: 'Email',      value: user.email },
                { icon: Phone,     label: 'Phone',      value: user.phone || '—' },
                { icon: MapPin,    label: 'Zone',       value: user.location || '—' },
                { icon: Building2, label: 'Department', value: user.department || '—' },
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
            {user.bio && (
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-xs text-foreground-tertiary font-medium mb-2">Bio</p>
                <p className="text-sm text-foreground-secondary leading-relaxed">{user.bio}</p>
              </div>
            )}
          </div>

          {/* Account info */}
          <div className="bg-background-secondary border border-border rounded-2xl p-6 flex flex-col gap-6">
            <h2 className="text-base font-semibold text-foreground">Account Information</h2>
            <div className="space-y-4">
              {[
                { icon: Shield, label: 'User ID',       value: user.id },
                { icon: Users,  label: 'Role',          value: user.role === 'supervisor' ? 'Supervisor' : 'Administrator' },
                { icon: Clock,  label: 'Last Login',    value: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
                { icon: Wifi,   label: 'Portal Access', value: 'Supervisor Dashboard' },
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

            <div className="mt-auto pt-6 border-t border-border">
              <p className="text-xs text-foreground-tertiary font-medium uppercase tracking-wider mb-3">Security</p>
              <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">Password</p>
                  <p className="text-xs text-foreground-tertiary">Keep it strong and unique</p>
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

      <ChangePasswordDrawer open={pwOpen} onClose={() => setPwOpen(false)} />
      <EditProfileDrawer
        open={editOpen}
        user={user}
        onSave={handleSave}
        onClose={() => setEditOpen(false)}
      />
    </>
  );
}
