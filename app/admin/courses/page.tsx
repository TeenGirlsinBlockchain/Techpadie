"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/app/lib/api-client";
import { CheckCircleIcon, XCircleIcon, EyeIcon } from "lucide-react";
import type { CourseStatus, CourseCategory } from "@prisma/client";

interface PendingCourse {
  id: string;
  title: string;
  slug: string;
  status: CourseStatus;
  category: CourseCategory;
  creator: {
    displayName: string;
    email: string;
  };
  createdAt: string;
}

export default function AdminCourseModerationPage() {
  const [courses, setCourses] = useState<PendingCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCourses = async () => {
    try {
      // Calls your listPendingCourses repository method
      const data = await fetchApi<{ data: PendingCourse[] }>("/api/admin/courses/pending?skip=0&take=50");
      setCourses(data.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load pending courses");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleModerate = async (courseId: string, action: "approve" | "reject") => {
    try {
      const reason = action === "reject" ? window.prompt("Reason for rejection:") : undefined;
      if (action === "reject" && !reason) return;

      const confirmMsg = action === "approve" 
        ? "Approve and publish? This will immediately queue AI generation jobs for quizzes and audio." 
        : "Reject this course?";
      if (!confirm(confirmMsg)) return;

      await fetchApi(`/api/admin/courses/${courseId}/${action}`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      });
      
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
    } catch (err: any) {
      alert(err.message || `Failed to ${action} course`);
    }
  };

  if (isLoading) return <div className="animate-pulse h-64 bg-white rounded-2xl" />;
  if (error) return <div className="p-4 bg-red-50 text-red-600 rounded-xl">{error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900">Course Moderation</h2>
        <p className="text-gray-500">Review submitted courses before they go live and trigger AI jobs.</p>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
          <CheckCircleIcon className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900">All caught up!</h3>
          <p className="text-gray-500">There are no courses pending review at the moment.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Course Info</th>
                <th className="p-4">Creator</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-gray-900 mb-1">{course.title || course.slug}</p>
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-[10px] font-bold rounded uppercase">
                      Pending Review
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-gray-800 text-sm">{course.creator?.displayName}</p>
                    <p className="text-xs text-gray-500">{course.creator?.email}</p>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                      {course.category.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="inline-flex items-center gap-1 px-3 py-1.5 text-gray-500 hover:text-[#227FA1] font-bold rounded-lg transition-colors mr-2">
                      <EyeIcon className="w-4 h-4" /> Preview
                    </button>
                    <button 
                      onClick={() => handleModerate(course.id, "approve")}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 font-bold rounded-lg hover:bg-emerald-100 transition-colors mr-2"
                    >
                      <CheckCircleIcon className="w-4 h-4" /> Approve
                    </button>
                    <button 
                      onClick={() => handleModerate(course.id, "reject")}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <XCircleIcon className="w-4 h-4" /> Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}