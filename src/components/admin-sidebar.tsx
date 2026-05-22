'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  BarChart3,
  AlertCircle,
  Wifi,
  Settings,
  FileText,
  X,
} from 'lucide-react';

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/supervisors', label: 'Manage Supervisors', icon: Users },
  { href: '/admin/workers', label: 'Manage Workers', icon: UserCheck },
  { href: '/admin/analytics', label: 'System Analytics', icon: BarChart3 },
  { href: '/admin/alerts', label: 'Manage Alerts', icon: AlertCircle },
  { href: '/admin/gateways', label: 'Manage Gateways', icon: Wifi },
  { href: '/admin/reports', label: 'Reports & Audit Logs', icon: FileText },
  { href: '/admin/settings', label: 'System Settings', icon: Settings },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-background border-r border-border flex flex-col transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-0`}
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-critical rounded flex items-center justify-center">
              <span className="text-xs font-bold text-white">A</span>
            </div>
            <h2 className="text-sm font-semibold text-foreground">Admin</h2>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-background-secondary rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-critical/10 text-critical font-medium'
                    : 'text-foreground-secondary hover:bg-background-secondary hover:text-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="text-xs text-foreground-tertiary">
            <p className="font-medium text-foreground-secondary">Admin Portal</p>
            <p className="mt-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-critical rounded-full"></span>
              Administrator
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
