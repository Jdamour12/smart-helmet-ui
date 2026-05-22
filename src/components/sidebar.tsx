'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Radio,
  Gauge,
  Thermometer,
  AlertTriangle,
  BarChart3,
  Wifi,
  Settings,
  X,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/helmets', label: 'Real-time Monitoring', icon: Radio },
  { href: '/dashboard/gas-analytics', label: 'Gas Analytics', icon: Gauge },
  { href: '/dashboard/environment', label: 'Temperature & Humidity', icon: Thermometer },
  { href: '/dashboard/impacts', label: 'Impact Detection', icon: AlertTriangle },
  { href: '/dashboard/compliance', label: 'Compliance Reports', icon: BarChart3 },
  { href: '/dashboard/network', label: 'Network Status', icon: Wifi },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-background border-r border-border flex flex-col transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-0`}
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Monitoring</h2>
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-background-secondary rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-foreground-secondary hover:bg-background-secondary hover:text-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="text-xs text-foreground-tertiary">
            <p className="font-medium text-foreground-secondary">System Status</p>
            <p className="mt-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-success rounded-full"></span>
              Online
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
