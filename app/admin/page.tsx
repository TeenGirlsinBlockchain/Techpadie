"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/app/lib/api-client";
import {
  UsersIcon,
  BookOpenIcon,
  GraduationCapIcon,
  AwardIcon,
  AlertTriangleIcon,
  TrendingUpIcon,
  ClockIcon,
  CheckCircle2Icon,
  UserPlusIcon,
} from "lucide-react";
import Link from "next/link";

interface AnalyticsData {
  users: { total: number; creators: number; students: number };
  courses: { total: number; published: number; pendingReview: number };
  enrollments: number;
  certificates: number;
  jobs: Record<string, number>;
}

export default function AdminOverviewPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApi<{ data: AnalyticsData }>("/api/admin/analytics")
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message || "Failed to load analytics"))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-[120px] bg-white rounded-xl border border-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
        {error}
      </div>
    );
  }

  const failedJobs = (data?.jobs?.FAILED || 0) + (data?.jobs?.DEAD || 0);
  const queuedJobs = data?.jobs?.QUEUED || 0;
  const completedJobs = data?.jobs?.COMPLETED || 0;

  const statCards = [
    {
      label: "Total Users",
      value: data?.users.total || 0,
      icon: UsersIcon,
      accent: "#227FA1",
      bg: "bg-[#227FA1]/[0.08]",
    },
    {
      label: "Students",
      value: data?.users.students || 0,
      icon: GraduationCapIcon,
      accent: "#6366f1",
      bg: "bg-indigo-50",
    },
    {
      label: "Creators",
      value: data?.users.creators || 0,
      icon: UserPlusIcon,
      accent: "#8b5cf6",
      bg: "bg-violet-50",
    },
    {
      label: "Published Courses",
      value: data?.courses.published || 0,
      icon: BookOpenIcon,
      accent: "#059669",
      bg: "bg-emerald-50",
    },
    {
      label: "Pending Review",
      value: data?.courses.pendingReview || 0,
      icon: ClockIcon,
      accent: "#d97706",
      bg: "bg-amber-50",
      link: "/admin/courses",
    },
    {
      label: "Enrollments",
      value: data?.enrollments || 0,
      icon: TrendingUpIcon,
      accent: "#227FA1",
      bg: "bg-[#227FA1]/[0.08]",
    },
    {
      label: "Certificates Issued",
      value: data?.certificates || 0,
      icon: AwardIcon,
      accent: "#059669",
      bg: "bg-emerald-50",
    },
    {
      label: "Failed Jobs",
      value: failedJobs,
      icon: AlertTriangleIcon,
      accent: failedJobs > 0 ? "#dc2626" : "#6b7280",
      bg: failedJobs > 0 ? "bg-red-50" : "bg-gray-50",
      link: "/admin/jobs",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Platform Overview
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          System health and key metrics at a glance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((stat, idx) => {
          const Card = (
            <div
              key={idx}
              className={`relative p-4 sm:p-5 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all group ${stat.link ? "cursor-pointer" : ""}`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${stat.bg}`}>
                <stat.icon className="w-[18px] h-[18px]" style={{ color: stat.accent }} />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-gray-900 leading-none mb-1">
                {stat.value.toLocaleString()}
              </p>
              <p className="text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {stat.label}
              </p>
            </div>
          );

          return stat.link ? (
            <Link key={idx} href={stat.link} className="block">
              {Card}
            </Link>
          ) : (
            <div key={idx}>{Card}</div>
          );
        })}
      </div>

      {/* Quick Actions / Job Health */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Job Queue Health */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-4">Job Queue Health</h3>
          <div className="space-y-3">
            {[
              { label: "Queued", value: queuedJobs, color: "bg-gray-400" },
              { label: "Processing", value: data?.jobs?.PROCESSING || 0, color: "bg-[#227FA1]" },
              { label: "Completed", value: completedJobs, color: "bg-emerald-500" },
              { label: "Failed", value: data?.jobs?.FAILED || 0, color: "bg-orange-500" },
              { label: "Dead", value: data?.jobs?.DEAD || 0, color: "bg-red-500" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-2 h-2 rounded-full ${row.color}`} />
                  <span className="text-sm text-gray-600">{row.label}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{row.value}</span>
              </div>
            ))}
          </div>
          <Link
            href="/admin/jobs"
            className="block mt-4 text-center text-xs font-semibold text-[#227FA1] hover:underline"
          >
            View All Jobs →
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Link
              href="/admin/creators"
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-[#227FA1]/[0.06] transition-colors group"
            >
              <span className="text-sm font-semibold text-gray-700 group-hover:text-[#227FA1]">
                Review Creator Applications
              </span>
              <span className="text-xs font-bold text-[#227FA1] bg-[#227FA1]/10 px-2 py-0.5 rounded">
                {data?.courses.pendingReview || 0} pending
              </span>
            </Link>
            <Link
              href="/admin/courses"
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-[#227FA1]/[0.06] transition-colors group"
            >
              <span className="text-sm font-semibold text-gray-700 group-hover:text-[#227FA1]">
                Moderate Course Submissions
              </span>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                {data?.courses.pendingReview || 0} waiting
              </span>
            </Link>
            <Link
              href="/admin/jobs"
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-[#227FA1]/[0.06] transition-colors group"
            >
              <span className="text-sm font-semibold text-gray-700 group-hover:text-[#227FA1]">
                Check Failed Jobs
              </span>
              {failedJobs > 0 && (
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                  {failedJobs} failed
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}