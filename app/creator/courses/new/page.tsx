"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchApi } from "@/app/lib/api-client";
import { ArrowLeftIcon } from "lucide-react";

const CATEGORIES = [
  { value: "BLOCKCHAIN_BASICS", label: "Blockchain Basics" },
  { value: "DEFI", label: "DeFi" },
  { value: "NFTS", label: "NFTs" },
  { value: "SMART_CONTRACTS", label: "Smart Contracts" },
  { value: "TRADING", label: "Trading" },
  { value: "SECURITY", label: "Security" },
  { value: "WEB3_DEV", label: "Web3 Development" },
  { value: "TOKENOMICS", label: "Tokenomics" },
  { value: "DIGITAL_SKILLS", label: "Digital Skills" },
  { value: "OTHER", label: "Other" },
];

const LEVELS = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
];

const LANGUAGES = [
  { value: "EN", label: "English" },
  { value: "FR", label: "French" },
  { value: "AR", label: "Arabic" },
  { value: "SW", label: "Swahili" },
  { value: "HA", label: "Hausa" },
  { value: "PT", label: "Portuguese" },
];

export default function NewCoursePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    language: "EN",
    level: "BEGINNER",
    category: "BLOCKCHAIN_BASICS",
    estimatedHours: "",
    thumbnailUrl: "",
  });

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const body: Record<string, unknown> = {
        title: form.title,
        description: form.description,
        language: form.language,
        level: form.level,
        category: form.category,
      };
      if (form.estimatedHours) body.estimatedHours = parseFloat(form.estimatedHours);
      if (form.thumbnailUrl.trim()) body.thumbnailUrl = form.thumbnailUrl.trim();

      const res = await fetchApi<{ data: { course: { id: string } } }>(
        "/api/creator/courses",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      router.push(`/creator/courses/${res.data.course.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create course");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/creator/courses"
          className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Create New Course</h1>
          <p className="text-sm text-gray-500">Fill in the basics — you can add modules and lessons after.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">
            Course Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            minLength={3}
            maxLength={200}
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. Introduction to Blockchain"
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#227FA1] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            minLength={10}
            maxLength={5000}
            rows={4}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="What will students learn in this course?"
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#227FA1] focus:border-transparent resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Category</label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#227FA1] focus:border-transparent"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Level</label>
            <select
              value={form.level}
              onChange={(e) => set("level", e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#227FA1] focus:border-transparent"
            >
              {LEVELS.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Language</label>
            <select
              value={form.language}
              onChange={(e) => set("language", e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#227FA1] focus:border-transparent"
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Estimated Hours <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={form.estimatedHours}
              onChange={(e) => set("estimatedHours", e.target.value)}
              placeholder="e.g. 2.5"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#227FA1] focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">
            Thumbnail Image URL <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="url"
            value={form.thumbnailUrl}
            onChange={(e) => set("thumbnailUrl", e.target.value)}
            placeholder="https://example.com/course-image.jpg"
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#227FA1] focus:border-transparent"
          />
          <p className="text-xs text-gray-400 mt-1">Paste a direct image URL. Leave blank to use an auto-generated placeholder.</p>
        </div>

        <div className="flex gap-3 pt-2">
          <Link
            href="/creator/courses"
            className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-center hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-6 py-3 rounded-xl bg-[#227FA1] text-white font-bold hover:bg-[#1a637e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Creating..." : "Create Course"}
          </button>
        </div>
      </form>
    </div>
  );
}
