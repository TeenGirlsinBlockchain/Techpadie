"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboardIcon,
  UsersIcon,
  BookOpenIcon,
  LogOutIcon,
  ShieldCheckIcon,
  MenuIcon,
  XIcon,
  ChevronRightIcon,
} from "lucide-react";

const NAV_LINKS = [
  { name: "Overview", href: "/admin", icon: LayoutDashboardIcon },
   { name: "Users", href: "/admin/users", icon: UsersIcon }, 
  { name: "Creator Approvals", href: "/admin/creators", icon: UsersIcon },
  { name: "Course Moderation", href: "/admin/courses", icon: BookOpenIcon },
  { name: "Job Monitor", href: "/admin/jobs", icon: ShieldCheckIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAdmin, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      router.replace(user ? "/dashboard" : "/login");
    }
  }, [isLoading, user, isAdmin, router]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (isLoading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafb]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-[3px] border-[#227FA1] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-gray-500">Loading admin...</p>
        </div>
      </div>
    );
  }

  const pageTitle = pathname === "/admin"
    ? "Overview"
    : NAV_LINKS.find((l) => pathname.startsWith(l.href) && l.href !== "/admin")?.name || "Admin";

  return (
    <div className="min-h-screen bg-[#f8fafb]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-[#0c1825] flex flex-col transition-transform duration-200 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#227FA1] flex items-center justify-center">
              <span className="text-white text-sm font-black">T</span>
            </div>
            <div>
              <p className="text-white text-sm font-bold tracking-tight leading-none">Techpadie</p>
              <p className="text-[#227FA1] text-[10px] font-semibold uppercase tracking-widest">Admin</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white p-1"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href ||
              (link.href !== "/admin" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-all
                  ${isActive
                    ? "bg-[#227FA1]/15 text-[#227FA1]"
                    : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
              >
                <link.icon className="w-[18px] h-[18px]" />
                {link.name}
                {isActive && <ChevronRightIcon className="w-3.5 h-3.5 ml-auto opacity-60" />}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="p-3 border-t border-white/[0.06]">
          <div className="px-3 py-2 mb-2">
            <p className="text-white text-xs font-bold truncate">{user.displayName}</p>
            <p className="text-gray-500 text-[10px] truncate">{user.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[13px] font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOutIcon className="w-[18px] h-[18px]" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-[260px]">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-14 bg-white/80 backdrop-blur-md border-b border-gray-200/60 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900 p-1.5 -ml-1.5"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-bold text-gray-800">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              {user.displayName}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}