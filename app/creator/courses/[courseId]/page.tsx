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
  XIcon,
  Loader2Icon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import type { CourseStatus, Language, CourseLevel, CourseCategory } from "@prisma/client";

// ─── Types ───────────────────────────────────────────────────────

interface CourseTranslation {
  language: Language;
  title: string;
  description: string;
}

interface LessonTranslation {
  language: Language;
  title: string;
}

interface Lesson {
  id: string;
  duration: string | null;
  sortOrder: number;
  translations: LessonTranslation[];
}

interface ModuleTranslation {
  language: Language;
  title: string;
}

interface Module {
  id: string;
  sortOrder: number;
  translations: ModuleTranslation[];
  lessons: Lesson[];
}

interface CourseDetail {
  id: string;
  status: CourseStatus;
  defaultLanguage: Language;
  level: CourseLevel;
  category: CourseCategory;
  modules: Module[];
  translations: CourseTranslation[];
}

// ─── Add Module Modal ────────────────────────────────────────────

function AddModuleModal({
  courseId,
  language,
  onClose,
  onSuccess,
}: {
  courseId: string;
  language: Language;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await fetchApi(`/api/creator/courses/${courseId}/modules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, language }),
      });
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create module");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-black text-gray-900">Add Module</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <XIcon className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>
          )}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Module Title <span className="text-red-500">*</span></label>
            <input
              autoFocus
              type="text"
              required
              minLength={2}
              maxLength={200}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. What is Blockchain?"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#227FA1] focus:border-transparent"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#227FA1] text-white font-bold text-sm hover:bg-[#1a637e] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Loader2Icon className="w-4 h-4 animate-spin" /> : "Add Module"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Add Lesson Modal ────────────────────────────────────────────

function AddLessonModal({
  courseId,
  moduleId,
  language,
  onClose,
  onSuccess,
}: {
  courseId: string;
  moduleId: string;
  language: Language;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({ title: "", content: "", duration: "", videoUrl: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const body: Record<string, unknown> = {
        title: form.title,
        content: form.content,
        language,
      };
      if (form.duration.trim()) body.duration = form.duration.trim();
      if (form.videoUrl.trim()) body.videoUrl = form.videoUrl.trim();

      await fetchApi(
        `/api/creator/courses/${courseId}/modules/${moduleId}/lessons`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create lesson");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-black text-gray-900">Add Lesson</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <XIcon className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>
          )}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Lesson Title <span className="text-red-500">*</span></label>
            <input
              autoFocus
              type="text"
              required
              minLength={2}
              maxLength={200}
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Understanding Distributed Ledgers"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#227FA1] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Content <span className="text-red-500">*</span>
              <span className="text-gray-400 font-normal ml-1">(min 10 characters)</span>
            </label>
            <textarea
              required
              minLength={10}
              maxLength={100000}
              rows={10}
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              placeholder="Write the lesson content here. This text will be used to generate quizzes, flashcards, summaries, and audio."
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#227FA1] focus:border-transparent resize-none font-mono text-sm"
            />
            <p className="text-xs text-gray-400 mt-1">{form.content.length.toLocaleString()} / 100,000 characters</p>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Duration <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              maxLength={50}
              value={form.duration}
              onChange={(e) => set("duration", e.target.value)}
              placeholder="e.g. 15 min"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#227FA1] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Video URL <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="url"
              value={form.videoUrl}
              onChange={(e) => set("videoUrl", e.target.value)}
              placeholder="https://youtube.com/watch?v=... or direct video URL"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#227FA1] focus:border-transparent"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#227FA1] text-white font-bold text-sm hover:bg-[#1a637e] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Loader2Icon className="w-4 h-4 animate-spin" /> : "Add Lesson"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Course Editor Page ──────────────────────────────────────────

export default function CourseEditorPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [showAddModule, setShowAddModule] = useState(false);
  const [addLessonForModuleId, setAddLessonForModuleId] = useState<string | null>(null);

  const loadCourse = async () => {
    try {
      const data = await fetchApi<{ data: { course: CourseDetail } }>(
        `/api/creator/courses/${courseId}`
      );
      setCourse(data.data.course);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load course details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const handleSubmitForReview = async () => {
    if (!confirm("Submit this course for review? You won't be able to edit it while it's pending.")) return;
    setIsSubmitting(true);
    try {
      await fetchApi(`/api/creator/courses/${courseId}/submit`, { method: "POST" });
      alert("Course submitted for review!");
      router.push("/creator/courses");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to submit course");
      setIsSubmitting(false);
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm("Delete this module and all its lessons?")) return;
    try {
      await fetchApi(`/api/creator/courses/${courseId}/modules/${moduleId}`, { method: "DELETE" });
      loadCourse();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete module");
    }
  };

  const handleDeleteLesson = async (moduleId: string, lessonId: string) => {
    if (!confirm("Delete this lesson?")) return;
    try {
      await fetchApi(
        `/api/creator/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
        { method: "DELETE" }
      );
      loadCourse();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete lesson");
    }
  };

  if (isLoading) return <div className="animate-pulse h-96 bg-white rounded-2xl" />;
  if (error || !course) return <div className="p-4 bg-red-50 text-red-600 rounded-xl">{error || "Not found"}</div>;

  const defaultTranslation =
    course.translations.find((t) => t.language === course.defaultLanguage) ??
    course.translations[0];

  const canEdit = course.status === "DRAFT" || course.status === "REJECTED";
  const hasContent = course.modules?.some((m) => m.lessons?.length > 0);

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

  return (
    <>
      {/* Add Module Modal */}
      {showAddModule && (
        <AddModuleModal
          courseId={courseId}
          language={course.defaultLanguage}
          onClose={() => setShowAddModule(false)}
          onSuccess={() => {
            setShowAddModule(false);
            loadCourse();
          }}
        />
      )}

      {/* Add Lesson Modal */}
      {addLessonForModuleId && (
        <AddLessonModal
          courseId={courseId}
          moduleId={addLessonForModuleId}
          language={course.defaultLanguage}
          onClose={() => setAddLessonForModuleId(null)}
          onSuccess={() => {
            setAddLessonForModuleId(null);
            loadCourse();
          }}
        />
      )}

      <div className="space-y-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/creator/courses"
              className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-black text-gray-900">
                  {defaultTranslation?.title || "Untitled Course"}
                </h1>
                <span
                  className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                    course.status === "DRAFT"
                      ? "bg-gray-100 text-gray-600"
                      : course.status === "PENDING_REVIEW"
                      ? "bg-orange-100 text-orange-600"
                      : course.status === "PUBLISHED"
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {course.status.replace(/_/g, " ")}
                </span>
              </div>
              <p className="text-sm text-gray-500 flex gap-2">
                <span>{course.category.replace(/_/g, " ")}</span> •{" "}
                <span>{course.level}</span> •{" "}
                <span className="uppercase">{course.defaultLanguage}</span> •{" "}
                <span>{course.modules.length} module{course.modules.length !== 1 ? "s" : ""}</span> •{" "}
                <span>{totalLessons} lesson{totalLessons !== 1 ? "s" : ""}</span>
              </p>
            </div>
          </div>

          {canEdit && (
            <button
              onClick={handleSubmitForReview}
              disabled={!hasContent || isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#227FA1] text-white font-bold rounded-xl shadow-lg hover:bg-[#1a637e] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? (
                <Loader2Icon className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <SendIcon className="w-4 h-4" /> Submit for Review
                </>
              )}
            </button>
          )}
        </div>

        {/* Warning: no content yet */}
        {canEdit && !hasContent && (
          <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-100 rounded-xl text-orange-800">
            <AlertCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Add content before submitting</p>
              <p className="text-sm opacity-90">
                You need at least one module with one lesson to submit for review.
              </p>
            </div>
          </div>
        )}

        {/* Rejected reason */}
        {course.status === "REJECTED" && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-800">
            <AlertCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Course was rejected</p>
              <p className="text-sm opacity-90">Fix the issues and resubmit for review.</p>
            </div>
          </div>
        )}

        {/* Curriculum */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <BookOpenIcon className="w-5 h-5 text-[#227FA1]" />
              Curriculum
            </h2>
            {canEdit && (
              <button
                onClick={() => setShowAddModule(true)}
                className="text-sm font-bold text-[#227FA1] hover:text-[#1a637e] flex items-center gap-1 px-3 py-1.5 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <PlusIcon className="w-4 h-4" /> Add Module
              </button>
            )}
          </div>

          <div className="p-6 space-y-6">
            {!course.modules || course.modules.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                <BookOpenIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium mb-2">No modules yet.</p>
                {canEdit && (
                  <button
                    onClick={() => setShowAddModule(true)}
                    className="text-[#227FA1] font-bold hover:underline text-sm"
                  >
                    + Create your first module
                  </button>
                )}
              </div>
            ) : (
              course.modules
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((mod, modIdx) => (
                  <div key={mod.id} className="border border-gray-200 rounded-xl overflow-hidden">
                    {/* Module header */}
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="font-bold text-gray-800">
                        Module {modIdx + 1}: {mod.translations[0]?.title ?? "Untitled Module"}
                      </h3>
                      {canEdit && (
                        <button
                          onClick={() => handleDeleteModule(mod.id)}
                          className="text-xs font-bold text-red-400 hover:text-red-600 flex items-center gap-1 px-2 py-1 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2Icon className="w-3.5 h-3.5" /> Delete
                        </button>
                      )}
                    </div>

                    {/* Lessons */}
                    <div className="p-2 space-y-1 bg-white">
                      {mod.lessons.length === 0 ? (
                        <p className="text-xs text-center py-4 text-gray-400">
                          No lessons yet — add one below.
                        </p>
                      ) : (
                        mod.lessons
                          .sort((a, b) => a.sortOrder - b.sortOrder)
                          .map((lesson, lessIdx) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg group transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <VideoIcon className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-700">
                                  {modIdx + 1}.{lessIdx + 1}{" "}
                                  {lesson.translations[0]?.title ?? "Untitled Lesson"}
                                </span>
                                {lesson.duration && (
                                  <span className="text-xs text-gray-400">{lesson.duration}</span>
                                )}
                              </div>
                              {canEdit && (
                                <button
                                  onClick={() => handleDeleteLesson(mod.id, lesson.id)}
                                  className="opacity-0 group-hover:opacity-100 text-xs font-bold text-red-400 hover:text-red-600 flex items-center gap-1 px-2 py-1 hover:bg-red-50 rounded-lg transition-all"
                                >
                                  <Trash2Icon className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          ))
                      )}

                      {canEdit && (
                        <button
                          onClick={() => setAddLessonForModuleId(mod.id)}
                          className="w-full text-left p-3 text-sm font-bold text-gray-400 hover:text-[#227FA1] hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
                        >
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
    </>
  );
}
