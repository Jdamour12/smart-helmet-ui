'use client';

import Link from 'next/link';
import { Shield, BarChart3, Users, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-primary-foreground">SH</span>
            </div>
            <span className="text-xl font-bold text-foreground">SafeHelm</span>
          </div>
          <Link
            href="/login"
            className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary-dark transition-colors"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">
            Mining Safety Made Smart
          </h1>
          <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
            Real-time helmet monitoring, instant alerts, and comprehensive analytics for worker safety in mining operations.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary-dark transition-colors inline-block"
          >
            Get Started
          </Link>
          <button className="px-8 py-3 border border-border text-foreground font-semibold rounded-lg hover:bg-background-secondary transition-colors">
            Learn More
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-background-secondary border-y border-border py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-foreground mb-16">
            Powerful Features
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: 'Real-time Monitoring',
                description: 'Monitor all helmets and workers in real-time with instant status updates.',
              },
              {
                icon: Zap,
                title: 'Instant Alerts',
                description: 'Receive immediate notifications for critical safety events and anomalies.',
              },
              {
                icon: BarChart3,
                title: 'Advanced Analytics',
                description: 'Comprehensive reports and insights on safety metrics and compliance.',
              },
              {
                icon: Users,
                title: 'User Management',
                description: 'Full control over supervisors, workers, and system access permissions.',
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-background border border-border rounded-lg p-6 space-y-4"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-foreground-secondary">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Portals Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center text-foreground mb-16">
          Access Your Portal
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Supervisor Portal */}
          <div className="bg-background-secondary border border-border rounded-xl p-8 space-y-6">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-foreground">Supervisor Portal</h3>
              <p className="text-foreground-secondary">
                Monitor your team, track helmet status, and manage daily operations with detailed analytics.
              </p>
            </div>
            <ul className="space-y-2 text-sm text-foreground-secondary">
              <li>✓ Real-time helmet monitoring</li>
              <li>✓ Worker activity tracking</li>
              <li>✓ Gas level analytics</li>
              <li>✓ Performance reports</li>
            </ul>
            <Link
              href="/login"
              className="block text-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary-dark transition-colors"
            >
              Access Supervisor Portal
            </Link>
          </div>

          {/* Admin Portal */}
          <div className="bg-background-secondary border border-border rounded-xl p-8 space-y-6">
            <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center">
              <Shield className="w-8 h-8 text-accent" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-foreground">Administrator Portal</h3>
              <p className="text-foreground-secondary">
                Manage supervisors, workers, gateways, and system-wide settings with full control.
              </p>
            </div>
            <ul className="space-y-2 text-sm text-foreground-secondary">
              <li>✓ Supervisor management</li>
              <li>✓ Worker administration</li>
              <li>✓ System analytics</li>
              <li>✓ Audit logs & compliance</li>
            </ul>
            <Link
              href="/login"
              className="block text-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary-dark transition-colors"
            >
              Access Admin Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-background-secondary border-y border-border py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: '100+', label: 'Active Helmets' },
              { number: '98%', label: 'Uptime' },
              { number: '24/7', label: 'Monitoring' },
              { number: '500ms', label: 'Alert Response' },
            ].map((stat, idx) => (
              <div key={idx} className="space-y-2">
                <p className="text-4xl font-bold text-primary">{stat.number}</p>
                <p className="text-foreground-secondary">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background-secondary py-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-foreground-tertiary">
          <p>© 2024 SafeHelm. All rights reserved. Mining Safety Matters.</p>
        </div>
      </footer>
    </div>
  );
}
