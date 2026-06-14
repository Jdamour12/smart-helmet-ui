import { http, httpUpload } from '@/lib/http';
import type { User, TokenResponse } from '@/lib/types';

export function login(email: string, password: string, role?: string) {
  return http<TokenResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, ...(role ? { role } : {}) }),
  });
}

export function logout() {
  return http('/auth/logout', { method: 'POST' });
}

export async function getMe(): Promise<User> {
  const raw = await http<any>('/auth/me');
  return { ...raw, name: raw.full_name ?? raw.name ?? '' };
}

export async function updateMe(data: Partial<User>): Promise<User> {
  const raw = await http<any>('/auth/me', {
    method: 'PATCH',
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      phone: data.phone,
      location: data.location,
      department: data.department,
      bio: data.bio,
    }),
  });
  return { ...raw, name: raw.full_name ?? raw.name ?? '' };
}

export function changePassword(currentPassword: string, newPassword: string) {
  return http('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
  });
}

export function forgotPassword(email: string) {
  return http('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(token: string, newPassword: string) {
  return http('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, new_password: newPassword }),
  });
}

export async function uploadAvatar(file: File) {
  const form = new FormData();
  form.append('file', file);
  const raw = await httpUpload<any>('/auth/me/avatar', form);
  return { avatar_url: raw.avatar_url ?? '' };
}
