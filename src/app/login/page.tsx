'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/hooks/use-auth';

const REMEMBER_KEY = 'safehelm_remember';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { mutate: login, isPending } = useLogin();

  // Load saved credentials on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(REMEMBER_KEY);
      if (saved) {
        const { email: savedEmail, password: savedPassword } = JSON.parse(saved);
        if (savedEmail) setEmail(savedEmail);
        if (savedPassword) setPassword(savedPassword);
        setRememberMe(true);
      }
    } catch {
      // ignore corrupt data
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Save or clear credentials based on Remember Me
    if (rememberMe) {
      localStorage.setItem(REMEMBER_KEY, JSON.stringify({ email, password }));
    } else {
      localStorage.removeItem(REMEMBER_KEY);
    }

    login(
      { email, password },
      {
        onSuccess: (data) => {
          try {
            const stored = localStorage.getItem('user');
            const me = stored ? JSON.parse(stored) : null;
            const role = me?.role ?? data.user?.role;
            router.push(role === 'admin' ? '/admin' : '/dashboard');
          } catch {
            router.push('/dashboard');
          }
        },
        onError: (err) => {
          setErrorMsg(err instanceof Error ? err.message : 'Invalid email or password. Please try again.');
        },
      },
    );
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side - Image with Overlay */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/mining-safety.jpg)' }}
        />
        <div className="absolute inset-0 bg-black/40" />
        {/* Logo top-left */}
        <div className="absolute top-8 left-8 z-10">
          <Link href="/">
            <Image
              src="/the_logo.png"
              alt="Smart Helmet Logo"
              width={72}
              height={72}
              className="w-18 h-18 object-cover rounded-full drop-shadow-lg"
              priority
            />
          </Link>
        </div>
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <div className="space-y-6">
            <p className="text-white text-xl font-semibold leading-relaxed max-w-lg">
              "Safety is not just a priority, it's our commitment. Real-time monitoring, instant alerts, lives protected."
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 lg:py-0">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold text-foreground">SmartHelmet</h1>
            <p className="text-foreground-secondary text-lg">Mining Safety Helmet Monitoring</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-background-secondary border border-border rounded-lg text-foreground placeholder-foreground-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-background-secondary border border-border rounded-lg text-foreground placeholder-foreground-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground-tertiary hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link href="/forgot-password" className="text-sm text-primary hover:text-primary-dark transition-colors">
                Forgot password?
              </Link>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-border bg-background-secondary accent-primary cursor-pointer"
                />
                <span className="text-sm text-foreground-secondary">Remember me</span>
              </label>
            </div>

            {errorMsg && (
              <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-500">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-primary-foreground font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Logging in...' : 'Log in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
