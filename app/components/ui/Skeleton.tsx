import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export default function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200';

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

// ─── Pre-built Skeleton Compositions ─────────────────────────────

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-3 space-y-4">
      <Skeleton className="h-44 w-full" />
      <div className="space-y-2 px-1">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
      </div>
      <div className="flex items-center gap-2 px-1 pt-2">
        <Skeleton variant="circular" className="h-8 w-8" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton variant="circular" className="h-5 w-5" />
      </div>
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

export function ActivitySkeleton() {
  return (
    <div className="flex items-start gap-3 p-3">
      <Skeleton variant="circular" className="h-9 w-9 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}