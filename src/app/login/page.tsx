'use client';

import { useState } from 'react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth, saveToken } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [role, setRole] = useState<'supervisor' | 'admin'>('supervisor');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await auth.login(email, password, role);
      saveToken(res.access_token);

      // Backend may or may not return a user object — fetch it explicitly
      try {
        const me = await auth.me();
        localStorage.setItem('user', JSON.stringify(me));
      } catch {
        // If /me fails, store minimal user info from what we know
        if (res.user) localStorage.setItem('user', JSON.stringify(res.user));
      }

      // Route based on the role the user selected
      if (role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side - Image with Overlay */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/mining-safety.jpg)',
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Quote and branding */}
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
          {/* Back to Home */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-foreground-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold text-foreground">SmartHelmet</h1>
            <p className="text-foreground-secondary text-lg">Mining Safety Helmet Monitoring</p>
          </div>

          {/* Role Selection */}
          <div className="bg-background-secondary border border-border rounded-lg p-4">
            <p className="text-sm font-medium text-foreground-secondary mb-3">Login as:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setRole('supervisor')}
                className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                  role === 'supervisor'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background border border-border text-foreground hover:border-primary'
                }`}
              >
                Supervisor
              </button>
              <button
                onClick={() => setRole('admin')}
                className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                  role === 'admin'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background border border-border text-foreground hover:border-primary'
                }`}
              >
                Administrator
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email/Username */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Email or Username
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'admin' ? 'admin@safehelm.com' : 'supervisor@safehelm.com'}
                className="w-full px-4 py-3 bg-background-secondary border border-border rounded-lg text-foreground placeholder-foreground-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Password
              </label>
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
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password & Remember Me */}
            <div className="flex items-center justify-between">
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:text-primary-dark transition-colors"
              >
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

            {/* Error Message */}
            {error && (
              <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-500">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-primary-foreground font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="bg-background-secondary border border-border/50 rounded-lg p-4 space-y-2">
            <p className="text-xs font-medium text-foreground-secondary uppercase">Demo Credentials</p>
            <div className="space-y-1 text-xs text-foreground-tertiary">
              <p><span className="font-medium">Supervisor:</span> supervisor@safehelm.com / password</p>
              <p><span className="font-medium">Admin:</span> admin@safehelm.com / password</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
