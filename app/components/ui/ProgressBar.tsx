import React from 'react';

type ProgressVariant = 'brand' | 'xp' | 'streak' | 'success';

interface ProgressBarProps {
  value: number; // 0-100
  variant?: ProgressVariant;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  className?: string;
}

const barColors: Record<ProgressVariant, string> = {
  brand: 'bg-brand-500',
  xp: 'bg-violet-500',
  streak: 'bg-orange-500',
  success: 'bg-emerald-500',
};

const trackColors: Record<ProgressVariant, string> = {
  brand: 'bg-brand-50',
  xp: 'bg-violet-50',
  streak: 'bg-orange-50',
  success: 'bg-emerald-50',
};

const sizeStyles: Record<string, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

export default function ProgressBar({
  value,
  variant = 'brand',
  size = 'md',
  showLabel = false,
  label,
  animated = true,
  className = '',
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <span className="text-xs font-semibold text-text-secondary">{label}</span>
          )}
          <span className="text-xs font-bold text-text-tertiary">
            {clampedValue}%
          </span>
        </div>
      )}
      <div
        className={`w-full rounded-full overflow-hidden ${trackColors[variant]} ${sizeStyles[size]}`}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full ${barColors[variant]} ${
            animated ? 'transition-all duration-700 ease-out' : ''
          }`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}