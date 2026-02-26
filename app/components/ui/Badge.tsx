import React from 'react';

type BadgeVariant =
  | 'default'
  | 'brand'
  | 'success'
  | 'warning'
  | 'error'
  | 'xp'
  | 'streak'
  | 'level';

type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-600',
  brand: 'bg-brand-50 text-brand-500',
  success: 'bg-emerald-50 text-emerald-600',
  warning: 'bg-amber-50 text-amber-600',
  error: 'bg-red-50 text-red-600',
  xp: 'bg-violet-50 text-violet-600',
  streak: 'bg-orange-50 text-orange-600',
  level: 'bg-brand-50 text-brand-600',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-3 py-1 text-xs',
};

export default function Badge({
  variant = 'default',
  size = 'md',
  children,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 font-bold uppercase tracking-wider rounded-lg
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}