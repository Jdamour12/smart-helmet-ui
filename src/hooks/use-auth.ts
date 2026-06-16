'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import * as authApi from '@/lib/auth';
import { saveToken, clearToken } from '@/lib/http';
import type { User } from '@/lib/types';

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: authApi.getMe,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useLogin() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password, role }: { email: string; password: string; role?: string }) =>
      authApi.login(email, password, role),
    onSuccess: async (data) => {
      saveToken(data.access_token);
      try {
        const me = await authApi.getMe();
        localStorage.setItem('user', JSON.stringify(me));
        qc.setQueryData(['me'], me);
        saveToken(data.access_token, me.role);
      } catch {
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          qc.setQueryData(['me'], data.user);
          saveToken(data.access_token, data.user.role);
        }
      }
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      clearToken();
      qc.clear();
      router.replace('/login');
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authApi.resetPassword(token, password),
  });
}

export function useUpdateMe() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<User>) => authApi.updateMe(data),
    onSuccess: (updated) => {
      qc.setQueryData(['me'], updated);
      localStorage.setItem('user', JSON.stringify(updated));
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      authApi.changePassword(currentPassword, newPassword),
  });
}

export function useUploadAvatar() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => authApi.uploadAvatar(file),
    onSuccess: (data) => {
      qc.setQueryData<User>(['me'], (prev) =>
        prev ? { ...prev, avatar_url: data.avatar_url } : prev,
      );
    },
  });
}
