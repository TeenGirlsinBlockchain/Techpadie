"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/app/lib/api-client";
import { UsersIcon, BookOpenIcon, ShieldCheckIcon, AlertCircleIcon } from "lucide-react";
import Link from "next/link";

interface AdminStats {
  totalUsers: number;
  pendingCreators: number;
  pendingCourses: number;
  failedJobs: number;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApi<{ data: AdminStats }>("/api/admin/analytics")
      .then((res) => setStats(res.data))
      .catch(() => console.error("Failed to load admin stats"))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div className="animate-pulse h-64 bg-white rounded-2xl" />;

  const statCards = [
    { label: "Total Users", value: stats?.totalUsers || 0, icon: UsersIcon, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Pending Creators", value: stats?.pendingCreators || 0, icon: UsersIcon, color: "text-orange-600", bg: "bg-orange-50", link: "/admin/creators" },
    { label: "Courses to Review", value: stats?.pendingCourses || 0, icon: BookOpenIcon, color: "text-purple-600", bg: "bg-purple-50", link: "/admin/courses" },
    { label: "Failed Jobs", value: stats?.failedJobs || 0, icon: AlertCircleIcon, color: "text-red-600", bg: "bg-red-50", link: "/admin/jobs" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-gray-900">Platform Overview</h2>
        <p className="text-gray-500">System health and moderation queues at a glance.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative group">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-3xl font-black text-gray-900 mb-1">{stat.value}</p>
            <p className="text-sm font-bold text-gray-500">{stat.label}</p>
            {stat.link && (
              <Link href={stat.link} className="absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:ring-[#227FA1]/20 transition-all" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}