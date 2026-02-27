"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchApi } from "@/app/lib/api-client";
import { 
  ArrowLeftIcon, 
  PlusIcon, 
  SendIcon, 
  BookOpenIcon,
  VideoIcon,
  AlertCircleIcon,
  CheckCircle2Icon
} from "lucide-react";
import Link from "next/link";
import type { CourseStatus, Language, CourseLevel, CourseCategory } from "@prisma/client";

// Mapped from your Prisma Schema
interface Lesson {
  id: string;
  title: string;
  duration: string | null;
  sortOrder: number;
}

interface Module {
  id: string;
  title: string;
  sortOrder: number;
  lessons: Lesson[];
}

interface CourseDetail {
  id: string;
  title: string;
  description: string;
  status: CourseStatus;
  defaultLanguage: Language;
  level: CourseLevel;
  category: CourseCategory;
  modules: Module[];
  translations: any[];
}

export default function CourseEditorPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadCourse = async () => {
    try {
      const data = await fetchApi<{ data: CourseDetail }>(`/api/creator/courses/${courseId}`);
      setCourse(data.data);
    } catch (err: any) {
      setError(err.message || "Failed to load course details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const handleSubmitForReview = async () => {
    if (!confirm("Are you sure you want to submit this course for review? You won't be able to edit it while it is pending.")) return;
    
    setIsSubmitting(true);
    try {
      await fetchApi(`/api/creator/courses/${courseId}/submit`, { method: "POST" });
      alert("Course submitted successfully!");
      router.push("/creator/courses");
    } catch (err: any) {
      alert(err.message || "Failed to submit course");
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="animate-pulse h-96 bg-white rounded-2xl" />;
  if (error || !course) return <div className="p-4 bg-red-50 text-red-600 rounded-xl">{error || "Not found"}</div>;

  const canEdit = course.status === "DRAFT" || course.status === "REJECTED";
  const hasContent = course.modules?.some(m => m.lessons?.length > 0);

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/creator/courses" className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-black text-gray-900">{course.title || "Untitled Course"}</h1>
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                course.status === "DRAFT" ? "bg-gray-100 text-gray-600" :
                course.status === "PENDING_REVIEW" ? "bg-orange-100 text-orange-600" :
                course.status === "PUBLISHED" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
              }`}>
                {course.status.replace("_", " ")}
              </span>
            </div>
            <p className="text-sm text-gray-500 flex gap-2">
              <span>{course.category.replace("_", " ")}</span> • 
              <span>{course.level}</span> • 
              <span className="uppercase">{course.defaultLanguage}</span>
            </p>
          </div>
        </div>

        {canEdit && (
          <button
            onClick={handleSubmitForReview}
            disabled={!hasContent || isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#227FA1] text-white font-bold rounded-xl shadow-lg hover:bg-[#1a637e] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? "Submitting..." : <><SendIcon className="w-4 h-4" /> Submit for Review</>}
          </button>
        )}
      </div>

      {/* Warning if cannot submit */}
      {canEdit && !hasContent && (
        <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-100 rounded-xl text-orange-800">
          <AlertCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm">Action Required</p>
            <p className="text-sm opacity-90">You must add at least one module and one lesson before submitting this course for review.</p>
          </div>
        </div>
      )}

      {/* Modules & Lessons Curriculum Builder */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <BookOpenIcon className="w-5 h-5 text-[#227FA1]" />
            Curriculum Structure
          </h2>
          {canEdit && (
            <button className="text-sm font-bold text-[#227FA1] hover:text-[#1a637e] flex items-center gap-1">
              <PlusIcon className="w-4 h-4" /> Add Module
            </button>
          )}
        </div>

        <div className="p-6 space-y-6">
          {!course.modules || course.modules.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
              <p className="text-gray-500 font-medium mb-2">No modules yet.</p>
              {canEdit && (
                <button className="text-[#227FA1] font-bold hover:underline">Create your first module</button>
              )}
            </div>
          ) : (
            course.modules.sort((a, b) => a.sortOrder - b.sortOrder).map((mod, modIdx) => (
              <div key={mod.id} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-bold text-gray-800">Module {modIdx + 1}: {mod.title}</h3>
                  {canEdit && <button className="text-xs font-bold text-gray-500 hover:text-gray-900">Edit</button>}
                </div>
                
                <div className="p-2 space-y-1 bg-white">
                  {mod.lessons.length === 0 ? (
                    <p className="text-xs text-center py-4 text-gray-400">No lessons in this module.</p>
                  ) : (
                    mod.lessons.sort((a, b) => a.sortOrder - b.sortOrder).map((lesson, lessIdx) => (
                      <div key={lesson.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg group transition-colors">
                        <div className="flex items-center gap-3">
                          <VideoIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">
                            {modIdx + 1}.{lessIdx + 1} {lesson.title}
                          </span>
                        </div>
                        {canEdit && <button className="text-xs font-bold text-gray-400 opacity-0 group-hover:opacity-100 hover:text-[#227FA1] transition-all">Edit Content</button>}
                      </div>
                    ))
                  )}
                  
                  {canEdit && (
                    <button className="w-full text-left p-3 text-sm font-bold text-gray-400 hover:text-[#227FA1] hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
                      <PlusIcon className="w-4 h-4" /> Add Lesson
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}