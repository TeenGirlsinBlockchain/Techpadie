"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/app/lib/api-client";
import { UsersIcon, VideoIcon, AwardIcon } from "lucide-react";
import type { CreatorStatus } from "@prisma/client";

interface CreatorProfileData {
  id: string;
  status: CreatorStatus;
  stats: {
    totalStudents: number;
    activeCourses: number;
    tokensDistributed: number;
  };
}

export default function CreatorOverviewPage() {
  const [profile, setProfile] = useState<CreatorProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApi<{ data: CreatorProfileData }>("/api/creator/profile")
      .then((res) => setProfile(res.data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div className="animate-pulse h-64 bg-white rounded-2xl" />;

  const statCards = [
    { label: "Active Courses", value: profile?.stats?.activeCourses || 0, icon: VideoIcon, color: "text-[#227FA1]", bg: "bg-blue-50" },
    { label: "Enrolled Students", value: profile?.stats?.totalStudents || 0, icon: UsersIcon, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "$FLARE Distributed", value: profile?.stats?.tokensDistributed || 0, icon: AwardIcon, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-gray-900">Studio Overview</h2>
        <p className="text-gray-500">Track your courses, students, and token payouts.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-3xl font-black text-gray-900 mb-1">{stat.value}</p>
            <p className="text-sm font-bold text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}