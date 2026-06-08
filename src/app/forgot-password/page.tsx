"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import AuthFrame from "@/components/auth-frame";
import { useForgotPassword } from "@/hooks/use-auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    forgotPassword(email, {
      onSuccess: () => setIsSubmitted(true),
      onError: () => setIsSubmitted(true), // show success regardless to prevent email enumeration
    });
  };

  return (
    <AuthFrame>
      {!isSubmitted ? (
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold text-foreground">Reset Password</h1>
            <p className="text-foreground-secondary">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@safehelm.com"
                className="w-full px-4 py-3 bg-background-secondary border border-border rounded-lg text-foreground placeholder-foreground-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-primary-foreground font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Sending..." : "Send Reset Link"}
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
            <h2 className="text-2xl font-bold text-foreground">Check your email</h2>
            <p className="text-foreground-secondary">
              We've sent password reset instructions to <span className="font-medium">{email}</span>
            </p>
          </div>

          <div className="bg-background-secondary border border-border/50 rounded-lg p-4 text-sm text-foreground-secondary space-y-2">
            <p>The reset link will expire in 24 hours.</p>
            <p>If you don't receive an email, check your spam folder or contact support.</p>
          </div>

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-primary hover:text-primary-dark transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      )}
    </AuthFrame>
  );
}
