'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Shield, Lock, Settings, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const SETTINGS_TABS = [
  {
    name: 'Personal Information',
    href: '/settings',
    icon: Settings
  },
  {
    name: 'Notifications',
    href: '/settings/notifications',
    icon: Bell
  },
  {
    name: 'Privacy & Security',
    href: '/settings/privacy-security',
    icon: Shield
  },
  {
    name: 'Password Change',
    href: '/settings/password-change',
    icon: Lock
  }
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className=" bg-[#EBEBEB]/60 font-sans text-[#333333] pt-32">
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-8">
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
            <h1 className="text-xl font-bold text-gray-800">Settings</h1>
            <p className="text-[11px] text-gray-500 mt-1">Manage your account</p>
          </div>

          <nav className="flex flex-col gap-2">
            {SETTINGS_TABS.map((tab) => {
              const isActive = pathname === tab.href;
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium",
                    isActive 
                      ? "text-[#333333] font-bold" 
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
        <div className="flex-1 max-w-3xl pt-2">
          {children}
        </div>
      </div>
    </div>
  );
}
