"use client";

import {
  Menu,
  Shield,
  Bell,
  User,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { mockAlerts } from "@/lib/mock-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AdminHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter();
  const unreadCount = useMemo(
    () => mockAlerts.filter((a) => !a.resolved).length,
    [mockAlerts],
  );

  const handleOpenProfile = () => router.push("/admin/profile");
  const handleOpenHelp = () => router.push("/docs");
  const handleLogout = () => router.push("/login");

  return (
    <header className="sticky top-0 z-40 bg-background-secondary border-b border-border px-5 py-4 flex items-center justify-between">
      {/* Left: menu toggle + logo */}
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
          <h1 className="text-lg font-semibold text-foreground hidden sm:block">
            Admin Portal
          </h1>
        </div>
      </div>

      {/* Right: notifications + profile */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button className="relative p-2 hover:bg-background-tertiary rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-foreground-secondary" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-critical rounded-full flex items-center justify-center text-[10px] font-bold text-white px-0.5 leading-none">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-9 h-9 bg-critical rounded-full flex items-center justify-center hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-critical/40">
              <span className="text-sm font-bold text-white select-none">
                AU
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56"
            style={
              {
                "--accent": "var(--sidebar-accent)",
                "--accent-foreground": "var(--sidebar-foreground)",
              } as React.CSSProperties
            }
          >
            <div className="px-3 py-3">
              <p className="font-semibold text-foreground text-sm">
                Admin User
              </p>
              <p className="text-xs text-foreground-tertiary mt-0.5">
                admin@safehelm.io
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2.5 cursor-pointer"
              onClick={handleOpenProfile}
            >
              <User className="w-4 h-4 text-foreground-secondary" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2.5 cursor-pointer"
              onClick={() => router.push("/admin/settings")}
            >
              <Settings className="w-4 h-4 text-foreground-secondary" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2.5 cursor-pointer"
              onClick={handleOpenHelp}
            >
              <HelpCircle className="w-4 h-4 text-foreground-secondary" />
              Help
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2.5 cursor-pointer text-critical focus:text-critical focus:bg-critical/10"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
