"use client";

import { useAuth } from "@/app/hooks/useAuth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboardIcon, 
  UsersIcon, 
  LogOutIcon, 
  VideoIcon,
  AwardIcon,
  SparklesIcon
} from "lucide-react";

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isApprovedCreator, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-[#227FA1] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Strict RBAC: Must be an approved creator
  if (!user || !isApprovedCreator) {
    router.replace(user ? "/dashboard" : "/login");
    return null;
  }

  const links = [
    { name: "Studio Overview", href: "/creator", icon: LayoutDashboardIcon },
    { name: "My Courses", href: "/creator/courses", icon: VideoIcon },
    { name: "Students", href: "/creator/students", icon: UsersIcon },
    { name: "Content AI", href: "/creator/content", icon: SparklesIcon },
    { name: "Rewards Setup", href: "/creator/rewards", icon: AwardIcon },
  ];

  return (
    <div className="min-h-screen bg-[#FCFDFE] flex">
      {/* Creator Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed inset-y-0 z-10">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <div className="w-8 h-8 bg-gradient-to-br from-[#227FA1] to-purple-600 rounded-lg flex items-center justify-center font-black text-white mr-3">
            C
          </div>
          <span className="font-bold text-gray-900 tracking-tight">Creator Studio</span>
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
                    ? "bg-[#227FA1]/10 text-[#227FA1]" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <link.icon className={`w-5 h-5 ${isActive ? "text-[#227FA1]" : "text-gray-400"}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
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
            {pathname.split("/").pop()?.replace("-", " ") || "Overview"}
          </h1>
          <Link href="/dashboard" className="text-sm font-bold text-gray-500 hover:text-[#227FA1] transition-colors">
            Switch to Student View →
          </Link>
        </header>
        <div className="p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}