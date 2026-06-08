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

export function getMe() {
  return http<User>('/auth/me');
}

export function updateMe(data: Partial<User>) {
  return http<User>('/auth/me', { method: 'PATCH', body: JSON.stringify(data) });
}

export function changePassword(currentPassword: string, newPassword: string) {
  return http('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
  });
}

export function forgotPassword(email: string) {
  return http('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
}

export function resetPassword(token: string, password: string) {
  return http('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) });
}

export function uploadAvatar(file: File) {
  const form = new FormData();
  form.append('avatar', file);
  return httpUpload<{ avatar_url: string }>('/auth/me/avatar', form);
}
