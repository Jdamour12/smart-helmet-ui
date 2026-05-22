'use client';

import { Menu, Shield } from 'lucide-react';

export function AdminHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-40 bg-background-secondary border-b border-border px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-background-tertiary rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-critical rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground hidden sm:block">
              Admin Portal
            </h1>
            <p className="text-xs text-foreground-tertiary hidden sm:block">
              SafeHelm System Administration
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm text-foreground">Administrator</p>
          <p className="text-xs text-foreground-tertiary">Full System Access</p>
        </div>
      </div>
    </header>
  );
}
