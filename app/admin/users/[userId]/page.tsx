"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchApi } from "@/app/lib/api-client";
import {
  ArrowLeftIcon,
  MailIcon,
  ShieldCheckIcon,
  UserCheckIcon,
  GraduationCapIcon,
  CheckCircleIcon,
  XCircleIcon,
  BookOpenIcon,
  AwardIcon,
  CoinsIcon,
  MonitorIcon,
  GlobeIcon,
  ClockIcon,
  ExternalLinkIcon,
} from "lucide-react";
import Link from "next/link";

interface Enrollment {
  id: string;
  language: string;
  isCompleted: boolean;
  completedAt: string | null;
  createdAt: string;
  course: {
    id: string;
    title: string;
    slug: string;
    category: string;
    level: string;
  };
}

interface Certificate {
  id: string;
  certificateNo: string;
  verificationUrl: string;
  issuedAt: string;
  course: { id: string; title: string; slug: string };
}

interface Reward {
  id: string;
  tokenAmount: number;
  status: string;
  txHash: string | null;
  createdAt: string;
  course: { id: string; title: string };
}

interface Session {
  id: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  expiresAt: string;
}

interface UserDetail {
  id: string;
  email: string;
  displayName: string;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  creatorProfile: {
    id: string;
    status: string;
    bio: string | null;
    expertise: string[];
    website: string | null;
    socialLinks: Record<string, string>;
    reviewedAt: string | null;
    createdAt: string;
  } | null;
  enrollments: Enrollment[];
  certificates: Certificate[];
  rewardLedger: Reward[];
  sessions: Session[];
  _count: {
    enrollments: number;
    certificates: number;
    rewardLedger: number;
    sessions: number;
  };
}

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  const [user, setUser] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"enrollments" | "certificates" | "rewards" | "sessions">("enrollments");

  useEffect(() => {
    fetchApi<{ data: { user: UserDetail } }>(`/api/admin/users/${userId}`)
      .then((res) => setUser(res.data.user))
      .catch((err) => setError(err.message || "Failed to load user"))
      .finally(() => setIsLoading(false));
  }, [userId]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatDateTime = (d: string) =>
    new Date(d).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getRoleBadge = (role: string) => {
    const map: Record<string, { bg: string; text: string; icon: typeof ShieldCheckIcon }> = {
      ADMIN: { bg: "bg-[#227FA1]/10", text: "text-[#227FA1]", icon: ShieldCheckIcon },
      CREATOR: { bg: "bg-emerald-50", text: "text-emerald-700", icon: UserCheckIcon },
      STUDENT: { bg: "bg-indigo-50", text: "text-indigo-700", icon: GraduationCapIcon },
    };
    const style = map[role] || map.STUDENT;
    const Icon = style.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${style.bg} ${style.text}`}>
        <Icon className="w-3.5 h-3.5" />
        {role}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      COMPLETED: "bg-emerald-50 text-emerald-600",
      PENDING: "bg-amber-50 text-amber-600",
      PROCESSING: "bg-blue-50 text-blue-600",
      FAILED: "bg-red-50 text-red-600",
    };
    return (
      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${colors[status] || "bg-gray-100 text-gray-600"}`}>
        {status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-32 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-48 bg-white rounded-2xl border border-gray-100 animate-pulse" />
        <div className="h-64 bg-white rounded-2xl border border-gray-100 animate-pulse" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-4">
        <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900">
          <ArrowLeftIcon className="w-4 h-4" /> Back
        </button>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <p className="text-red-700 font-semibold">{error || "User not found"}</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: "enrollments" as const, label: "Enrollments", count: user._count.enrollments, icon: BookOpenIcon },
    { key: "certificates" as const, label: "Certificates", count: user._count.certificates, icon: AwardIcon },
    { key: "rewards" as const, label: "Rewards", count: user._count.rewardLedger, icon: CoinsIcon },
    { key: "sessions" as const, label: "Sessions", count: user._count.sessions, icon: MonitorIcon },
  ];

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-[#227FA1] transition-colors"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        All Users
      </Link>

      {/* Profile Card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#227FA1] to-[#1a5f7a] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-2xl font-bold">
              {user.displayName.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-gray-900">{user.displayName}</h2>
              {getRoleBadge(user.role)}
              {user.isActive ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <CheckCircleIcon className="w-3.5 h-3.5" /> Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-500">
                  <XCircleIcon className="w-3.5 h-3.5" /> Inactive
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
              <MailIcon className="w-3.5 h-3.5" />
              {user.email}
              {user.emailVerified && (
                <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-500 ml-1" />
              )}
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="bg-gray-50 px-3 py-2 rounded-lg">
                <span className="font-bold text-gray-900 text-lg tabular-nums">{user._count.enrollments}</span>
                <p className="text-gray-500 font-medium">Enrollments</p>
              </div>
              <div className="bg-gray-50 px-3 py-2 rounded-lg">
                <span className="font-bold text-gray-900 text-lg tabular-nums">{user._count.certificates}</span>
                <p className="text-gray-500 font-medium">Certificates</p>
              </div>
              <div className="bg-gray-50 px-3 py-2 rounded-lg">
                <span className="font-bold text-gray-900 text-lg tabular-nums">{user._count.rewardLedger}</span>
                <p className="text-gray-500 font-medium">Rewards</p>
              </div>
              <div className="bg-gray-50 px-3 py-2 rounded-lg">
                <p className="text-gray-500 font-medium">Joined</p>
                <span className="font-semibold text-gray-700">{formatDate(user.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Creator Profile (if exists) */}
        {user.creatorProfile && (
          <div className="mt-6 pt-5 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <UserCheckIcon className="w-4 h-4 text-[#227FA1]" />
              <p className="text-sm font-bold text-gray-900">Creator Profile</p>
              {getStatusBadge(user.creatorProfile.status)}
            </div>
            {user.creatorProfile.bio && (
              <p className="text-sm text-gray-600 mb-3">{user.creatorProfile.bio}</p>
            )}
            <div className="flex flex-wrap gap-1.5">
              {user.creatorProfile.expertise.map((exp, i) => (
                <span key={i} className="px-2 py-0.5 bg-[#227FA1]/10 text-[#227FA1] text-[10px] font-bold rounded-md">
                  {exp}
                </span>
              ))}
            </div>
            {user.creatorProfile.website && (
              <a
                href={user.creatorProfile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#227FA1] font-medium mt-2 hover:underline"
              >
                <GlobeIcon className="w-3 h-3" />
                {user.creatorProfile.website}
                <ExternalLinkIcon className="w-3 h-3" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? "bg-white text-[#227FA1] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
            <span className={`ml-1 px-1.5 py-0.5 rounded text-[10px] ${
              activeTab === tab.key ? "bg-[#227FA1]/10 text-[#227FA1]" : "bg-gray-200 text-gray-500"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        {/* Enrollments */}
        {activeTab === "enrollments" && (
          user.enrollments.length === 0 ? (
            <div className="p-10 text-center">
              <BookOpenIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No enrollments yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {user.enrollments.map((e) => (
                <div key={e.id} className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{e.course.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                        {e.course.category?.replace(/_/g, " ")}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                        {e.course.level}
                      </span>
                      <span className="text-[10px] font-bold text-[#227FA1] bg-[#227FA1]/10 px-1.5 py-0.5 rounded">
                        {e.language}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] font-bold text-[#227FA1]">Enrolled</span>
                    <span className="text-[11px] text-gray-400">{formatDate(e.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Certificates */}
        {activeTab === "certificates" && (
          user.certificates.length === 0 ? (
            <div className="p-10 text-center">
              <AwardIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No certificates issued.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {user.certificates.map((c) => (
                <div key={c.id} className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{c.course.title}</p>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">{c.certificateNo}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <a
                      href={c.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-[#227FA1] hover:underline flex items-center gap-1"
                    >
                      Verify <ExternalLinkIcon className="w-3 h-3" />
                    </a>
                    <span className="text-[11px] text-gray-400">{formatDate(c.issuedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Rewards */}
        {activeTab === "rewards" && (
          user.rewardLedger.length === 0 ? (
            <div className="p-10 text-center">
              <CoinsIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No rewards claimed.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {user.rewardLedger.map((r) => (
                <div key={r.id} className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{r.course.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {r.tokenAmount} tokens
                      {r.txHash && (
                        <span className="text-gray-400 font-mono ml-2">tx: {r.txHash.slice(0, 12)}...</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {getStatusBadge(r.status)}
                    <span className="text-[11px] text-gray-400">{formatDate(r.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Sessions */}
        {activeTab === "sessions" && (
          user.sessions.length === 0 ? (
            <div className="p-10 text-center">
              <MonitorIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No active sessions.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {user.sessions.map((s) => {
                const isExpired = new Date(s.expiresAt) < new Date();
                return (
                  <div key={s.id} className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 truncate">{s.userAgent || "Unknown device"}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        IP: {s.ipAddress || "unknown"} · Started {formatDateTime(s.createdAt)}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      {isExpired ? (
                        <span className="text-[11px] font-bold text-gray-400">Expired</span>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}