'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Lock, Settings, ArrowLeft, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';

const SETTINGS_TABS = [
  {
    name: 'Personal Information',
    href: '/settings',
    icon: Settings
  },
  // {
  //   name: 'Notifications',
  //   href: '/settings/notifications',
  //   icon: Bell
  // },
  // {
  //   name: 'Privacy & Security',
  //   href: '/settings/privacy-security',
  //   icon: Shield
  // },
  {
    name: 'Password Change',
    href: '/settings/password-change',
    icon: Lock
  }
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="bg-[#DEE0E1]/60 text-[#333333] pt-20 md:pt-32 min-h-screen">
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8 md:gap-12">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-6 md:space-y-8">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-300 hover:border-[#EB5500] text-gray-500 hover:text-[#EB5500] transition-colors text-sm font-medium bg-transparent"
            >
              <ArrowLeft size={16} />
              Back to the homepage
            </Link>
          </div>

          <div>
            <h1 className="text-xl font-medium text-gray-800">Settings</h1>
            <p className="text-[11px] text-gray-500 mt-1">Manage your account</p>
          </div>

          <nav className="flex flex-col sm:flex-row md:flex-col gap-1 md:gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 no-scrollbar">
            {SETTINGS_TABS.map((tab) => {
              const isActive = pathname === tab.href;
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-sm transition-all text-sm font-medium whitespace-nowrap md:whitespace-normal",
                    isActive
                      ? "text-[#333333] font-medium bg-black/5 md:bg-transparent"
                      : "text-gray-500 hover:text-[#333333] hover:bg-black/5"
                  )}
                >
                  <Icon size={16} className={cn(isActive ? "text-[#333333]" : "text-gray-400")} />
                  {tab.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 max-w-3xl pt-2 pb-20 md:pb-0">
          <React.Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px] w-full">
              <Loader size={40} className="animate-spin text-[#EB5500]" />
            </div>
          }>
            {children}
          </React.Suspense>
        </div>
      </div>
    </div>
  );
}
