"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/app/lib/api-client";
import { RefreshCwIcon, AlertTriangleIcon, CheckCircleIcon, ClockIcon } from "lucide-react";
import type { JobStatus, JobType } from "@prisma/client";

interface JobData {
  id: string;
  type: JobType;
  status: JobStatus;
  attempts: number;
  maxAttempts: number;
  lastError: string | null;
  scheduledAt: string;
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState<string | null>(null);

  const loadJobs = async () => {
    try {
      // Fetches the queue (you can add pagination params later)
      const data = await fetchApi<{ data: JobData[] }>("/api/admin/jobs?skip=0&take=50");
      setJobs(data.data || []);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
    // Optional: set an interval here to auto-refresh the queue every 10s
    const interval = setInterval(loadJobs, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRetry = async (jobId: string) => {
    setIsRetrying(jobId);
    try {
      await fetchApi(`/api/admin/jobs/${jobId}/retry`, { method: "POST" });
      await loadJobs(); // Refresh the list to show status change
    } catch (err: any) {
      alert(err.message || "Failed to retry job");
    } finally {
      setIsRetrying(null);
    }
  };

  const getStatusBadge = (status: JobStatus) => {
    const maps: Record<JobStatus, { color: string, icon: any }> = {
      QUEUED: { color: "bg-gray-100 text-gray-600", icon: ClockIcon },
      PROCESSING: { color: "bg-blue-100 text-blue-600", icon: RefreshCwIcon },
      COMPLETED: { color: "bg-emerald-100 text-emerald-600", icon: CheckCircleIcon },
      FAILED: { color: "bg-orange-100 text-orange-600", icon: AlertTriangleIcon },
      DEAD: { color: "bg-red-100 text-red-600", icon: AlertTriangleIcon },
    };
    const { color, icon: Icon } = maps[status];
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${color}`}>
        <Icon className={`w-3.5 h-3.5 ${status === "PROCESSING" ? "animate-spin" : ""}`} />
        {status}
      </span>
    );
  };

  if (isLoading) return <div className="animate-pulse h-64 bg-white rounded-2xl" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Job Monitor</h2>
          <p className="text-gray-500">Track background tasks like AI generation and token transfers.</p>
        </div>
        <button onClick={loadJobs} className="flex items-center gap-2 text-sm font-bold text-[#227FA1] hover:underline">
          <RefreshCwIcon className="w-4 h-4" /> Refresh
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
          <CheckCircleIcon className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900">Queue is empty</h3>
          <p className="text-gray-500">No background jobs are currently recorded.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Job Type</th>
                <th className="p-4">Status</th>
                <th className="p-4">Attempts</th>
                <th className="p-4">Details</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-gray-900 text-sm">{job.type.replace(/_/g, " ")}</p>
                    <p className="text-xs text-gray-400">ID: {job.id.slice(-8)}</p>
                  </td>
                  <td className="p-4">{getStatusBadge(job.status)}</td>
                  <td className="p-4 text-sm font-medium text-gray-600">
                    {job.attempts} / {job.maxAttempts}
                  </td>
                  <td className="p-4 max-w-[200px]">
                    {job.lastError ? (
                      <p className="text-xs text-red-500 truncate" title={job.lastError}>
                        {job.lastError}
                      </p>
                    ) : (
                      <span className="text-xs text-gray-400">--</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {(job.status === "FAILED" || job.status === "DEAD") && (
                      <button 
                        onClick={() => handleRetry(job.id)}
                        disabled={isRetrying === job.id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
                      >
                        {isRetrying === job.id ? "Retrying..." : "Retry Job"}
                      </button>
                    )}
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