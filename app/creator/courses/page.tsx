"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/app/lib/api-client";
import Link from "next/link";
import { PlusIcon, FileEditIcon, BookOpenIcon } from "lucide-react";
import type { CourseStatus, CourseCategory, Language } from "@prisma/client";

interface CreatorCourse {
  id: string;
  title: string;
  status: CourseStatus;
  category: CourseCategory;
  defaultLanguage: Language;
  createdAt: string;
}

export default function CreatorCoursesPage() {
  const [courses, setCourses] = useState<CreatorCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApi<{ data: CreatorCourse[] }>("/api/creator/courses?skip=0&take=20")
      .then((res) => setCourses(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const getStatusBadge = (status: CourseStatus) => {
    const maps: Record<CourseStatus, { color: string, label: string }> = {
      DRAFT: { color: "bg-gray-100 text-gray-600", label: "Draft" },
      PENDING_REVIEW: { color: "bg-orange-100 text-orange-600", label: "In Review" },
      PUBLISHED: { color: "bg-emerald-100 text-emerald-600", label: "Live" },
      REJECTED: { color: "bg-red-100 text-red-600", label: "Rejected" },
      ARCHIVED: { color: "bg-gray-200 text-gray-500", label: "Archived" }
    };
    const badge = maps[status];
    return <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${badge.color}`}>{badge.label}</span>;
  };

  if (isLoading) return <div className="animate-pulse h-64 bg-white rounded-2xl" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-900">My Courses</h2>
          <p className="text-gray-500">Manage your blockchain and digital skills content.</p>
        </div>
        <Link 
          href="/creator/courses/new" 
          className="flex items-center gap-2 px-5 py-2.5 bg-[#227FA1] text-white font-bold rounded-xl shadow-lg hover:bg-[#1a637e] transition-colors"
        >
          <PlusIcon className="w-5 h-5" /> Create Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-[#227FA1] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpenIcon className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">You haven't created any courses yet</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">Start sharing your Web3 knowledge with the world.</p>
          <Link href="/creator/courses/new" className="text-[#227FA1] font-bold hover:underline">
            + Create your first course
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                {getStatusBadge(course.status)}
                <span className="text-xs font-bold text-gray-400 uppercase">{course.defaultLanguage}</span>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-1">{course.title || "Untitled Course"}</h3>
              <p className="text-sm text-gray-500 mb-6">{course.category.replace("_", " ")}</p>
              
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <p className="text-xs text-gray-400">Created {new Date(course.createdAt).toLocaleDateString()}</p>
                <Link 
                  href={`/creator/courses/${course.id}`}
                  className="p-2 text-gray-400 hover:text-[#227FA1] bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <FileEditIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}