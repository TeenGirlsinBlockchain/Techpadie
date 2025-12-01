"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, BookOpenIcon, GlobeAltIcon, Cog8ToothIcon } from '@heroicons/react/24/outline';
import { ChevronDoubleLeftIcon } from '@heroicons/react/24/solid';

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: HomeIcon },
  { name: 'My Courses', href: '/dashboard/my-courses', icon: BookOpenIcon },
  { name: 'Explore Courses', href: '/dashboard/explore', icon: GlobeAltIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog8ToothIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  // Helper component for individual navigation links
  const NavLink = ({ item }: { item: typeof navItems[0] }) => {
    const isActive = pathname === item.href;
    return (
      <Link
        href={item.href}
        className={`
          flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-inter font-medium text-sm
          ${isActive
            ? 'bg-purple-700 text-white shadow-lg' 
            : 'text-zinc-400 hover:bg-zinc-800 hover:text-white' 
          }
        `}
      >
        <item.icon className="h-5 w-5" />
        <span>{item.name}</span>
      </Link>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#111827] text-white p-4 w-64 fixed top-0 left-0">
      
      {/* Logo/Brand (Eduflex replaced with Techpadie style) */}
      <div className="flex items-center justify-between h-16 px-2 mb-8">
        <span className="text-2xl font-inter font-bold text-teal-400">Techpadie</span>
        <button aria-label="Collapse Sidebar" className="text-zinc-400 hover:text-white transition">
            <ChevronDoubleLeftIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col space-y-2 grow">
        {navItems.map((item) => (
          <NavLink key={item.name} item={item} />
        ))}
      </nav>
      
     
      <div className="mt-4 pt-4 border-t border-zinc-700">
        <p className="text-xs text-zinc-500">DA | John Doe</p>
      </div>
    </div>
  );
}