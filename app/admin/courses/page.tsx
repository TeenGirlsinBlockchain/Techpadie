// FILE: app/admin/courses/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchApi } from "@/app/lib/api-client";
import {
  CheckCircle2Icon,
  XCircleIcon,
  InboxIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BookOpenIcon,
  LayersIcon,
} from "lucide-react";

interface PendingCourse {
  id: string;
  slug: string;
  status: string;
  category: string;
  level: string;
  defaultLanguage: string;
  estimatedHours: number | null;
  translations: {
    language: string;
    title: string;
    description: string;
  }[];
  _count: {
    enrollments: number;
    modules: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface PaginatedResponse {
  data: {
    items: PendingCourse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function AdminCourseModerationPage() {
  const [courses, setCourses] = useState<PendingCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadCourses = useCallback(async (p: number) => {
    setIsLoading(true);
    try {
      const res = await fetchApi<PaginatedResponse>(`/api/admin/courses?page=${p}&limit=10`);
      setCourses(res.data.items || []);
      setTotalPages(res.data.totalPages || 1);
      setTotal(res.data.total || 0);
      setPage(p);
    } catch (err: unknown) {
      console.error(err instanceof Error ? err.message : "Failed to load courses");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourses(1);
  }, [loadCourses]);

  const handleModerate = async (courseId: string, action: "approve" | "reject") => {
    let reason: string | undefined;
    if (action === "reject") {
      const input = window.prompt("Reason for rejection:");
      if (!input) return;
      reason = input;
    }

    if (action === "approve") {
      const confirmed = window.confirm(
        "Approve and publish? This will queue AI generation jobs for quizzes, flashcards, summaries, and audio."
      );
      if (!confirmed) return;
    }

    setActionLoading(courseId);
    try {
      await fetchApi(`/api/admin/courses/${courseId}/${action}`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      });
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
      setTotal((prev) => Math.max(0, prev - 1));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : `Failed to ${action} course`);
    } finally {
      setActionLoading(null);
    }
  };

  const getTitle = (course: PendingCourse) => {
    const t = course.translations.find((t) => t.language === course.defaultLanguage) || course.translations[0];
    return t?.title || course.slug;
  };

  const getDescription = (course: PendingCourse) => {
    const t = course.translations.find((t) => t.language === course.defaultLanguage) || course.translations[0];
    return t?.description || "";
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 bg-white rounded-xl border border-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Course Moderation
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {total} course{total !== 1 ? "s" : ""} pending review
        </p>
      </div>

      {/* Empty state */}
      {courses.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <InboxIcon className="w-7 h-7 text-emerald-500" />
          </div>
          <h3 className="text-base font-bold text-gray-900">All caught up!</h3>
          <p className="text-sm text-gray-500 mt-1">No courses pending review.</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white border border-gray-100 rounded-xl p-4 sm:p-5 hover:border-gray-200 transition-colors"
              >
                <div className="flex flex-col gap-4">
                  {/* Top row: title + meta */}
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-lg bg-[#227FA1]/10 flex items-center justify-center flex-shrink-0">
                      <BookOpenIcon className="w-5 h-5 text-[#227FA1]" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900">{getTitle(course)}</p>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">
                        {getDescription(course)}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-50 text-amber-700 uppercase">
                          {course.status.replace("_", " ")}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-gray-100 text-gray-600">
                          {course.category.replace(/_/g, " ")}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-gray-100 text-gray-600">
                          {course.level}
                        </span>
                        <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded bg-gray-100 text-gray-600">
                          <LayersIcon className="w-3 h-3" />
                          {course._count.modules} module{course._count.modules !== 1 ? "s" : ""}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-[#227FA1]/[0.08] text-[#227FA1]">
                          {course.defaultLanguage}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 sm:flex-shrink-0">
                      <button
                        onClick={() => handleModerate(course.id, "approve")}
                        disabled={actionLoading === course.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-100 transition disabled:opacity-50"
                      >
                        <CheckCircle2Icon className="w-3.5 h-3.5" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleModerate(course.id, "reject")}
                        disabled={actionLoading === course.id}
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
                onClick={() => loadCourses(page - 1)}
                disabled={page <= 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => loadCourses(page + 1)}
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