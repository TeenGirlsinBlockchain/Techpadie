"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { fetchApi } from "@/app/lib/api-client";
import {
  SearchIcon,
  UsersIcon,
  ShieldCheckIcon,
  UserCheckIcon,
  GraduationCapIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowUpRightIcon,
} from "lucide-react";

interface UserItem {
  id: string;
  email: string;
  displayName: string;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  creatorProfile?: { status: string } | null;
  _count: { enrollments: number; certificates: number };
}

interface PaginatedResponse {
  data: {
    items: UserItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const ROLES = [
  { key: "", label: "All Users", icon: UsersIcon },
  { key: "STUDENT", label: "Students", icon: GraduationCapIcon },
  { key: "CREATOR", label: "Creators", icon: UserCheckIcon },
  { key: "ADMIN", label: "Admins", icon: ShieldCheckIcon },
];

export default function AdminUsersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [role, setRole] = useState(searchParams.get("role") || "");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (role) params.set("role", role);
      if (search) params.set("q", search);

      const res = await fetchApi<PaginatedResponse>(`/api/admin/users?${params}`);
      setUsers(res.data.items);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setIsLoading(false);
    }
  }, [page, role, search]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    setPage(1);
  }, [role, search]);

  const getRoleBadge = (r: string) => {
    const map: Record<string, { bg: string; text: string }> = {
      ADMIN: { bg: "bg-[#227FA1]/10", text: "text-[#227FA1]" },
      CREATOR: { bg: "bg-emerald-50", text: "text-emerald-700" },
      STUDENT: { bg: "bg-indigo-50", text: "text-indigo-700" },
    };
    const style = map[r] || { bg: "bg-gray-100", text: "text-gray-600" };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold ${style.bg} ${style.text}`}>
        {r}
      </span>
    );
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-500 text-sm mt-0.5">{total.toLocaleString()} total users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Role tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 overflow-x-auto">
          {ROLES.map((r) => (
            <button
              key={r.key}
              onClick={() => setRole(r.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                role === r.key
                  ? "bg-white text-[#227FA1] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <r.icon className="w-3.5 h-3.5" />
              {r.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#227FA1]/30 focus:border-[#227FA1]"
          />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-white rounded-xl border border-gray-100 animate-pulse" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
          <UsersIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-600">No users found</p>
          <p className="text-sm text-gray-400 mt-1">Try a different search or filter.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="text-left px-5 py-3">User</th>
                  <th className="text-left px-5 py-3">Role</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Enrollments</th>
                  <th className="text-left px-5 py-3">Certificates</th>
                  <th className="text-left px-5 py-3">Joined</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => router.push(`/admin/users/${u.id}`)}
                    className="hover:bg-[#227FA1]/[0.02] transition-colors cursor-pointer group"
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-gray-900 text-sm">{u.displayName}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </td>
                    <td className="px-5 py-3.5">{getRoleBadge(u.role)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {u.isActive ? (
                          <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <XCircleIcon className="w-4 h-4 text-red-400" />
                        )}
                        <span className={`text-xs font-semibold ${u.isActive ? "text-emerald-600" : "text-red-500"}`}>
                          {u.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-medium text-gray-700 tabular-nums">
                      {u._count.enrollments}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-medium text-gray-700 tabular-nums">
                      {u._count.certificates}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-500">{formatDate(u.createdAt)}</td>
                    <td className="px-5 py-3.5">
                      <ArrowUpRightIcon className="w-4 h-4 text-gray-300 group-hover:text-[#227FA1] transition-colors" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {users.map((u) => (
              <Link
                href={`/admin/users/${u.id}`}
                key={u.id}
                className="block bg-white border border-gray-100 rounded-xl p-4 hover:border-[#227FA1]/20 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{u.displayName}</p>
                    <p className="text-xs text-gray-400 truncate">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {getRoleBadge(u.role)}
                    <ArrowUpRightIcon className="w-3.5 h-3.5 text-gray-300" />
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
                  <span className={`flex items-center gap-1 font-semibold ${u.isActive ? "text-emerald-600" : "text-red-500"}`}>
                    {u.isActive ? <CheckCircleIcon className="w-3.5 h-3.5" /> : <XCircleIcon className="w-3.5 h-3.5" />}
                    {u.isActive ? "Active" : "Inactive"}
                  </span>
                  <span>{u._count.enrollments} enrollments</span>
                  <span>{u._count.certificates} certs</span>
                  <span className="ml-auto">{formatDate(u.createdAt)}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeftIcon className="w-3.5 h-3.5" /> Prev
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next <ChevronRightIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}