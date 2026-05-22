'use client';

import React from 'react';
import Drawer from '@/app/components/ui/Drawer';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  side?: 'left' | 'right';
  children: React.ReactNode;
}

export default function MobileDrawer({
  isOpen,
  onClose,
  title = 'Menu',
  side = 'left',
  children,
}: MobileDrawerProps) {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} side={side} title={title}>
      <div className="flex flex-col h-full bg-white">
        {children}
      </div>
    </Drawer>
  );
}
