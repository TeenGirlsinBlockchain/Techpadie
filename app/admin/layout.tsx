"use client";

import { useAuth } from "@/app/hooks/useAuth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboardIcon, 
  UsersIcon, 
  BookOpenIcon, 
  LogOutIcon,
  ShieldCheckIcon
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAdmin, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-[#227FA1] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Strict RBAC: If not logged in OR not an admin, kick them out
  if (!user || !isAdmin) {
    router.replace(user ? "/dashboard" : "/login");
    return null;
  }

  const links = [
    { name: "Overview", href: "/admin", icon: LayoutDashboardIcon },
    { name: "Creator Approvals", href: "/admin/creators", icon: UsersIcon },
    { name: "Course Moderation", href: "/admin/courses", icon: BookOpenIcon },
    { name: "Job Monitor", href: "/admin/jobs", icon: ShieldCheckIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col fixed inset-y-0 z-10">
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <div className="w-8 h-8 bg-[#227FA1] rounded-lg flex items-center justify-center font-black mr-3">A</div>
          <span className="font-bold tracking-tight">Techpadie Admin</span>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-[#227FA1] text-white" 
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <link.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400"}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOutIcon className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-lg font-bold text-gray-800 capitalize">
            {pathname.split("/").pop()?.replace("-", " ") || "Admin Overview"}
          </h1>
          <div className="text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1.5 rounded-full">
            Admin: {user.displayName}
          </div>
        </header>
        <div className="p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}