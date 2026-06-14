'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Radio,
  Gauge,
  Thermometer,
  AlertTriangle,
  BarChart3,
  Wifi,
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
        className={`fixed left-0 top-0 h-screen w-64 bg-sidebar flex flex-col transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-0`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-sidebar-border relative flex items-center justify-center">
          <button
            onClick={onClose}
            className="lg:hidden absolute top-1/2 -translate-y-1/2 right-3 p-1 hover:bg-sidebar-accent rounded transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>
          <Link href="/dashboard" onClick={onClose}>
            <Image
              src="/the_logo.png"
              alt="SafeHelm Logo"
              width={48}
              height={48}
              className="w-12 h-12 object-cover rounded-full"
              priority
            />
          </Link>
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
                    : 'text-foreground-secondary hover:bg-sidebar-accent hover:text-sidebar-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
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
