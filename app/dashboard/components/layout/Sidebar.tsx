"use client";

import React from 'react';
import Link from 'next/link';
import { HomeIcon, BookOpenIcon, TrophyIcon, UserCircleIcon, Cog6ToothIcon, WalletIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', icon: HomeIcon, label: 'Dashboard' },
  { href: '/dashboard/explore', icon: BookOpenIcon, label: 'Explore Courses' },
  { href: '/dashboard/my-courses', icon: TrophyIcon, label: 'My Courses' },
  { href: '/dashboard/rewards', icon: WalletIcon, label: 'Rewards' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div 
      className="fixed top-0 left-0 h-full w-64 flex flex-col shadow-xl z-30 text-white"
      style={{ backgroundColor: '#227FA1' }} 
    >
      
      {/* Logo Area */}
      <div className="p-6 flex items-center h-20 border-b border-white/20">
        <span className="text-2xl font-bold font-inter">
          Techpadie
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`
                flex items-center p-3 rounded-lg transition-colors duration-200 
                ${isActive 
                  ? 'font-semibold text-gray-900 bg-white' 
                  : 'hover:bg-white/10 text-white' 
                }
              `}
            >
              <item.icon className="h-6 w-6 mr-3" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Links (User/Settings) */}
      <div className="p-4 border-t border-white/20 space-y-2">
        <Link 
          href="/dashboard/profile" 
          className="flex items-center p-3 rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
        >
          <UserCircleIcon className="h-6 w-6 mr-3" />
          <span>Profile</span>
        </Link>
        <Link 
          href="/dashboard/settings" 
          className="flex items-center p-3 rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
        >
          <Cog6ToothIcon className="h-6 w-6 mr-3" />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  );
}