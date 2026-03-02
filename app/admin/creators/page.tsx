"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchApi } from "@/app/lib/api-client";
import {
  CheckCircle2Icon,
  XCircleIcon,
  InboxIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon,
} from "lucide-react";

interface PendingCreator {
  id: string;
  bio: string | null;
  expertise: string[];
  website: string | null;
  socialLinks: Record<string, string>;
  user: {
    id: string;
    email: string;
    displayName: string;
  };
  createdAt: string;
}

interface PaginatedResponse {
  data: {
    items: PendingCreator[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function AdminCreatorsPage() {
  const [creators, setCreators] = useState<PendingCreator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadCreators = useCallback(async (p: number) => {
    setIsLoading(true);
    try {
      const res = await fetchApi<PaginatedResponse>(`/api/admin/creators?page=${p}&limit=10`);
      setCreators(res.data.items || []);
      setTotalPages(res.data.totalPages || 1);
      setTotal(res.data.total || 0);
      setPage(p);
    } catch (err: unknown) {
      console.error(err instanceof Error ? err.message : "Failed to load creators");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCreators(1);
  }, [loadCreators]);

  const handleModerate = async (profileId: string, action: "approve" | "reject") => {
    let reason: string | undefined;
    if (action === "reject") {
      const input = window.prompt("Reason for rejection:");
      if (!input) return;
      reason = input;
    }

    setActionLoading(profileId);
    try {
      await fetchApi(`/api/admin/creators/${profileId}/${action}`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      });
      // Remove from list and update count
      setCreators((prev) => prev.filter((c) => c.id !== profileId));
      setTotal((prev) => Math.max(0, prev - 1));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : `Failed to ${action} creator`);
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 bg-white rounded-xl border border-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Creator Approvals
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {total} pending application{total !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Empty state */}
      {creators.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <InboxIcon className="w-7 h-7 text-emerald-500" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Inbox Zero!</h3>
          <p className="text-sm text-gray-500 mt-1">No pending creator applications right now.</p>
        </div>
      ) : (
        <>
          {/* Cards (responsive — stacks on mobile, table-like on desktop) */}
          <div className="space-y-3">
            {creators.map((creator) => (
              <div
                key={creator.id}
                className="bg-white border border-gray-100 rounded-xl p-4 sm:p-5 hover:border-gray-200 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Avatar + Info */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#227FA1]/10 flex items-center justify-center flex-shrink-0">
                      <UserIcon className="w-5 h-5 text-[#227FA1]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {creator.user.displayName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{creator.user.email}</p>
                      {creator.bio && (
                        <p className="text-xs text-gray-600 mt-1.5 line-clamp-2">{creator.bio}</p>
                      )}
                      {/* Expertise tags */}
                      {creator.expertise.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {creator.expertise.map((exp, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-[#227FA1]/[0.08] text-[#227FA1] text-[10px] font-bold rounded"
                            >
                              {exp}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Date + Actions */}
                  <div className="flex items-center gap-2 sm:flex-col sm:items-end sm:gap-3">
                    <p className="text-[10px] text-gray-400 font-medium">
                      {new Date(creator.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <div className="flex gap-2 ml-auto sm:ml-0">
                      <button
                        onClick={() => handleModerate(creator.id, "approve")}
                        disabled={actionLoading === creator.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-100 transition disabled:opacity-50"
                      >
                        <CheckCircle2Icon className="w-3.5 h-3.5" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleModerate(creator.id, "reject")}
                        disabled={actionLoading === creator.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 transition disabled:opacity-50"
                      >
                        <XCircleIcon className="w-3.5 h-3.5" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => loadCreators(page - 1)}
                disabled={page <= 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => loadCreators(page + 1)}
                disabled={page >= totalPages}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}