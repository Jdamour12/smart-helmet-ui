"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle } from "lucide-react";
import AuthFrame from "@/components/auth-frame";
import { useResetPassword } from "@/hooks/use-auth";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const { mutate: resetPassword, isPending } = useResetPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid or missing reset token. Request a new reset link.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    resetPassword(
      { token, password },
      {
        onSuccess: () => setDone(true),
        onError: (err) => setError(err instanceof Error ? err.message : "Reset failed"),
      },
    );
  };

  return (
    <AuthFrame>
      {!done ? (
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold text-foreground">Set New Password</h1>
            <p className="text-foreground-secondary">
              Enter your new password below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-background-secondary border border-border rounded-lg text-foreground placeholder-foreground-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-background-secondary border border-border rounded-lg text-foreground placeholder-foreground-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-critical">{error}</p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-primary-foreground font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Saving..." : "Reset Password"}
            </button>
          </form>

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-primary hover:text-primary-dark transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      ) : (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Password updated</h2>
            <p className="text-foreground-secondary">
              Your password has been reset. You can now sign in with your new password.
            </p>
          </div>

          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-primary hover:bg-primary-dark text-primary-foreground font-semibold rounded-lg transition-colors"
          >
            Go to Login
          </Link>
        </div>
      )}
    </AuthFrame>
  );
}
