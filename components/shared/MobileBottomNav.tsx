'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Package, ListOrdered, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { token } = useSelector((state: any) => state.auth);
  const router = useRouter();

  const bottomNavItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Book', href: '/booking', icon: Package },
    { name: 'Orders', href: '/orders', icon: ListOrdered },
    { name: 'Chat', href: '/chat', icon: MessageSquare },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-gray-200 px-6 py-3 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] pb-[calc(12px+env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-between">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const requiresAuth = ['/booking', '/orders', '/chat'].includes(item.href);

          const handleNavClick = (e: React.MouseEvent) => {
            if (requiresAuth && !token) {
              e.preventDefault();
              router.push('/login');
            }
          };

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className="flex flex-col items-center gap-1 cursor-pointer"
            >
              <div
                className={cn(
                  "p-2 rounded-xl transition-all",
                  isActive
                    ? "bg-[#EB5500]/10 text-[#EB5500]"
                    : "text-gray-400 hover:bg-black/5 hover:text-gray-600"
                )}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium tracking-wider",
                  isActive ? "text-[#EB5500]" : "text-gray-400"
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
