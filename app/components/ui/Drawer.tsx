'use client';

import React, { useEffect, useCallback } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  side?: 'left' | 'right';
  title?: string;
  children: React.ReactNode;
}

export default function Drawer({
  isOpen,
  onClose,
  side = 'left',
  title,
  children,
}: DrawerProps) {
  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const slideFrom = side === 'left' ? '-translate-x-full' : 'translate-x-full';
  const position = side === 'left' ? 'left-0' : 'right-0';

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`
          absolute top-0 ${position} h-full w-[280px] max-w-[85vw]
          bg-white shadow-2xl
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : slideFrom}
        `}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-text-primary">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 text-text-tertiary transition-colors"
              aria-label="Close menu"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}