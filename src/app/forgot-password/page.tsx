"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import AuthFrame from "@/components/auth-frame";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate sending recovery email
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthFrame>
      {!isSubmitted ? (
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold text-foreground">
              Reset Password
            </h1>
            <p className="text-foreground-secondary">
              Enter your email address and we'll send you instructions to reset
              your password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Email Address
              </label>
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
              disabled={isLoading}
              className="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-primary-foreground font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {/* Back to Login */}
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
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Check your email
            </h2>
            <p className="text-foreground-secondary">
              We've sent password reset instructions to{" "}
              <span className="font-medium">{email}</span>
            </p>
          </div>

          {/* Additional Info */}
          <div className="bg-background-secondary border border-border/50 rounded-lg p-4 text-sm text-foreground-secondary space-y-2">
            <p>The reset link will expire in 24 hours.</p>
            <p>
              If you don't receive an email, check your spam folder or contact
              support.
            </p>
          </div>

          {/* Back to Login */}
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
