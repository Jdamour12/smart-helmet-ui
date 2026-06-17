"use client";

import { Menu, Bell, User, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearToken } from "@/lib/http";
import type { User as AppUser } from "@/lib/types";
import {
  useNotifications, useUnreadNotificationCount, useReadAllNotifications, useReadNotification,
} from "@/hooks/use-notifications";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter();
  const [user, setUser] = useState<AppUser | null>(null);

  const { data: notifications } = useNotifications();
  const { data: unread } = useUnreadNotificationCount();
  const { mutate: readAll } = useReadAllNotifications();
  const { mutate: readOne } = useReadNotification();
  const notificationList = notifications ?? [];
  const unreadCount = (unread?.count ?? notificationList.filter(n => !n.read).length);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try { setUser(JSON.parse(stored) as AppUser); } catch { /* ignore */ }
    }
  }, []);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  const handleLogout = () => {
    clearToken();
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-background-secondary border-b border-border px-6 py-5.5 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-background-tertiary rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-foreground hidden sm:block">
            Smart Helmet Dashboard
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 hover:bg-background-tertiary rounded-lg transition-colors overflow-visible">
              <Bell className="w-5 h-5 text-foreground-secondary" />
              {unreadCount > 0 && (
                <span
                  className="pointer-events-none absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-[5px] rounded-full bg-red-500 text-white text-[10px] font-bold leading-none ring-2 ring-background-secondary"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-3 py-3">
              <p className="font-semibold text-foreground text-sm">Notifications</p>
              {unreadCount > 0 && (
                <button onClick={() => readAll()} className="text-xs text-primary hover:underline">
                  Mark all read
                </button>
              )}
            </div>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              {notificationList.length === 0 ? (
                <p className="px-3 py-4 text-sm text-foreground-tertiary text-center">No notifications</p>
              ) : (
                notificationList.map((n) => (
                  <DropdownMenuItem
                    key={n.id}
                    className={`flex flex-col items-start gap-0.5 cursor-pointer ${!n.read ? 'bg-primary/5' : ''}`}
                    onClick={() => !n.read && readOne(n.id)}
                  >
                    <span className="text-sm text-foreground">{n.message}</span>
                    <span className="text-xs text-foreground-tertiary">
                      {new Date(n.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </DropdownMenuItem>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-9 h-9 bg-primary rounded-full flex items-center justify-center hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary/40">
              <span className="text-sm font-bold text-primary-foreground select-none">{initials}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56"
            style={{ "--accent": "var(--sidebar-accent)", "--accent-foreground": "var(--sidebar-foreground)" } as React.CSSProperties}
          >
            <div className="px-3 py-3">
              <p className="font-semibold text-foreground text-sm">{user?.name ?? "Supervisor"}</p>
              <p className="text-xs text-foreground-tertiary mt-0.5">{user?.email ?? ""}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2.5 cursor-pointer" onClick={() => router.push("/dashboard/profile")}>
              <User className="w-4 h-4 text-foreground-secondary" />
              Profile
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
