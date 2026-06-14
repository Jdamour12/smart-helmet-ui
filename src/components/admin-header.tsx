"use client";

import { Menu, Shield, Bell, User, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearToken } from "@/lib/http";
import type { User as AppUser } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AdminHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter();
  const [user, setUser] = useState<AppUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try { setUser(JSON.parse(stored) as AppUser); } catch { /* ignore */ }
    }
  }, []);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "A";

  const handleLogout = () => {
    clearToken();
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-background-secondary border-b border-border px-5 py-5.5 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-background-tertiary rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-foreground hidden sm:block">Admin Portal</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative p-2 hover:bg-background-tertiary rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-foreground-secondary" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-9 h-9 bg-critical rounded-full flex items-center justify-center hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-critical/40">
              <span className="text-sm font-bold text-white select-none">{initials}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56"
            style={{ "--accent": "var(--sidebar-accent)", "--accent-foreground": "var(--sidebar-foreground)" } as React.CSSProperties}
          >
            <div className="px-3 py-3">
              <p className="font-semibold text-foreground text-sm">{user?.name ?? "Admin"}</p>
              <p className="text-xs text-foreground-tertiary mt-0.5">{user?.email ?? ""}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2.5 cursor-pointer" onClick={() => router.push("/admin/profile")}>
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
