"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchApi } from "@/app/lib/api-client";
import {
  RefreshCwIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  ClockIcon,
  PlayIcon,
  SkullIcon,
  ZapIcon,
} from "lucide-react";

interface JobCounts {
  QUEUED?: number;
  PROCESSING?: number;
  COMPLETED?: number;
  FAILED?: number;
  DEAD?: number;
}

interface AnalyticsData {
  jobs: JobCounts;
}

export default function AdminJobsPage() {
  const [jobCounts, setJobCounts] = useState<JobCounts>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTriggeringCron, setIsTriggeringCron] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const loadJobs = useCallback(async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    try {
      const res = await fetchApi<{ data: AnalyticsData }>("/api/admin/analytics");
      setJobCounts(res.data.jobs || {});
      setLastRefresh(new Date());
    } catch (err: unknown) {
      console.error(err instanceof Error ? err.message : "Failed to load job data");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
    // Auto-refresh every 15s
    const interval = setInterval(() => loadJobs(), 15000);
    return () => clearInterval(interval);
  }, [loadJobs]);

  const triggerCron = async () => {
    setIsTriggeringCron(true);
    try {
      await fetchApi("/api/jobs/process", {
        method: "POST",
        headers: {
          "x-cron-secret": "manual-trigger", // This needs the real secret
        },
      });
      // Refresh data after processing
      setTimeout(() => loadJobs(true), 2000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to trigger job processing");
    } finally {
      setIsTriggeringCron(false);
    }
  };

  const totalJobs = Object.values(jobCounts).reduce((a, b) => a + (b || 0), 0);
  const failedTotal = (jobCounts.FAILED || 0) + (jobCounts.DEAD || 0);

  const statusConfig = [
    {
      key: "QUEUED",
      label: "Queued",
      description: "Waiting to be processed",
      icon: ClockIcon,
      value: jobCounts.QUEUED || 0,
      color: "text-gray-600",
      bg: "bg-gray-100",
      barColor: "bg-gray-400",
    },
    {
      key: "PROCESSING",
      label: "Processing",
      description: "Currently being executed",
      icon: PlayIcon,
      value: jobCounts.PROCESSING || 0,
      color: "text-[#227FA1]",
      bg: "bg-[#227FA1]/[0.08]",
      barColor: "bg-[#227FA1]",
    },
    {
      key: "COMPLETED",
      label: "Completed",
      description: "Successfully finished",
      icon: CheckCircle2Icon,
      value: jobCounts.COMPLETED || 0,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      barColor: "bg-emerald-500",
    },
    {
      key: "FAILED",
      label: "Failed",
      description: "Will be retried automatically",
      icon: AlertTriangleIcon,
      value: jobCounts.FAILED || 0,
      color: "text-orange-600",
      bg: "bg-orange-50",
      barColor: "bg-orange-500",
    },
    {
      key: "DEAD",
      label: "Dead",
      description: "Max retries exceeded",
      icon: SkullIcon,
      value: jobCounts.DEAD || 0,
      color: "text-red-600",
      bg: "bg-red-50",
      barColor: "bg-red-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 bg-white rounded-xl border border-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Job Monitor
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Background task queue — AI generation, audio, token transfers, certificates.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadJobs(true)}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
          >
            <RefreshCwIcon className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={triggerCron}
            disabled={isTriggeringCron}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#227FA1] rounded-lg hover:bg-[#1b6a88] disabled:opacity-50 transition"
          >
            <ZapIcon className="w-3.5 h-3.5" />
            {isTriggeringCron ? "Running..." : "Process Now"}
          </button>
        </div>
      </div>

      {/* Summary bar */}
      <div className="bg-white border border-gray-100 rounded-xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
            Queue Summary
          </p>
          <p className="text-[10px] text-gray-400">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>

        {/* Progress bar */}
        {totalJobs > 0 ? (
          <div className="h-3 rounded-full bg-gray-100 overflow-hidden flex">
            {statusConfig.map(
              (s) =>
                s.value > 0 && (
                  <div
                    key={s.key}
                    className={`${s.barColor} transition-all duration-500`}
                    style={{ width: `${(s.value / totalJobs) * 100}%` }}
                    title={`${s.label}: ${s.value}`}
                  />
                )
            )}
          </div>
        ) : (
          <div className="h-3 rounded-full bg-gray-100" />
        )}

        <div className="flex flex-wrap gap-4 mt-3">
          {statusConfig.map((s) => (
            <div key={s.key} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${s.barColor}`} />
              <span className="text-[11px] text-gray-500">{s.label}</span>
              <span className="text-[11px] font-bold text-gray-700">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {statusConfig.map((s) => (
          <div
            key={s.key}
            className={`p-4 rounded-xl border transition-colors ${
              s.value > 0 && (s.key === "FAILED" || s.key === "DEAD")
                ? "border-red-200 bg-red-50/50"
                : "border-gray-100 bg-white"
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 ${s.bg}`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className="text-2xl font-black text-gray-900">{s.value}</p>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mt-0.5">
              {s.label}
            </p>
            <p className="text-[10px] text-gray-400 mt-1">{s.description}</p>
          </div>
        ))}
      </div>

      {/* Info banner */}
      {failedTotal > 0 && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertTriangleIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-800">
              {failedTotal} job{failedTotal !== 1 ? "s" : ""} need attention
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              Failed jobs retry automatically with exponential backoff. Dead jobs have exceeded max retries.
              Check logs or Prisma Studio for details.
            </p>
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <h3 className="text-sm font-bold text-gray-800 mb-3">How the Job Queue Works</h3>
        <div className="grid sm:grid-cols-2 gap-4 text-xs text-gray-600">
          <div>
            <p className="font-semibold text-gray-700 mb-1">Processing</p>
            <p>
              Jobs are processed by a worker via <code className="px-1 py-0.5 bg-gray-100 rounded text-[11px]">POST /api/jobs/process</code> or
              the <code className="px-1 py-0.5 bg-gray-100 rounded text-[11px]">scripts/worker.ts</code> polling loop.
              Set up a cron job to hit the endpoint every 1-5 minutes.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-1">Retry Strategy</p>
            <p>
              Failed jobs retry with exponential backoff (30s → 60s → 120s...).
              After max attempts, jobs are marked DEAD and require manual investigation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}