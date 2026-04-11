'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, ChevronDown, Globe, LogOut, Settings, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
];

export function Navbar() {
  const { t, i18n } = useTranslation('common');
  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const profileRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { name: t('navbar.home'), href: '/' },
    { name: t('navbar.orders'), href: '/orders' },
    { name: t('navbar.history'), href: '/history' },
    { name: t('navbar.chat'), href: '/chat' },
    { name: t('navbar.contact'), href: '/contact' },
  ];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setLangOpen(false);
  };

  const currentLang = languages.find((l) => l.code === (i18n.language || 'fr')) || languages[0];

  return (
    <nav className="fixed top-5 left-0 right-0 z-[100] flex justify-center w-full px-4 md:px-0">
      <div className="container w-full flex items-center justify-between">
        
        {/* Language Pill */}
        <div className="relative" ref={langRef}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-2.5 h-11 px-2 border border-primary rounded-full bg-black/40 backdrop-blur-xl cursor-pointer hover:bg-black/50 transition-all group shadow-lg"
          >
            <div className="w-5 h-5 rounded-full overflow-hidden relative border border-white/20 shadow-inner">
               <div className="absolute inset-0 bg-primary/20 animate-pulse" />
               <Globe size={20} className="text-white/80" />
            </div>
            <span className="text-white font-medium text-xs tracking-widest uppercase">{currentLang.code}</span>
            <ChevronDown 
              size={12} 
              className={cn("text-white/50 transition-transform duration-300", langOpen && "rotate-180")} 
            />
          </motion.div>

          <AnimatePresence>
            {langOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute top-13 left-0 w-40 bg-white backdrop-blur-2xl rounded-sm overflow-hidden p-1.5 z-[101] shadow-2xl"
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={cn(
                      "w-full flex items-center gap-3 p-2.5 rounded-sm cursor-pointer transition-all text-sm font-medium",
                      i18n.language === lang.code 
                        ? "bg-primary text-white" 
                        : "text-black/60 hover:bg-black/10 hover:text-black"
                    )}
                  >
                    <span className="opacity-70 font-medium">{lang.name}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Center Navigation Pill */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="hidden md:flex items-center bg-black/40 backdrop-blur-2xl border border-white/10 p-1.5 rounded-lg shadow-2xl"
        >
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'relative px-6 py-2.5 text-base font-medium transition-all rounded-xl',
                  isActive ? 'text-white' : 'text-white/40 hover:text-white'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-lg border border-white/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </motion.div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden w-11 h-11 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white/90 hover:text-white transition-all shadow-lg active:scale-95"
          >
            <Menu size={20} />
          </button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:flex w-11 h-11 items-center justify-center rounded bg-black/10 backdrop-blur-xs border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all cursor-pointer relative"
          >
            <Bell size={26} />
            <span className="absolute top-1.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-black animate-pulse" />
          </motion.button>

          <div ref={profileRef} className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-11 h-11 rounded-full border-2 border-white/10 overflow-hidden cursor-pointer relative hover:border-primary/50 transition-all shadow-lg ring-offset-2 ring-offset-black"
            >
              <Image 
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces&auto=format" 
                alt="Avatar" 
                fill 
                className="object-cover"
              />
            </motion.button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.9 }}
                  transition={{ duration: 0.2, type: "spring", damping: 20, stiffness: 300 }}
                  className="absolute top-13 right-0 w-64 bg-white backdrop-blur-2xl rounded-xl overflow-hidden shadow-2xl border border-white/10 p-5 z-[101]"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-primary/30 p-1 shadow-2xl">
                      <Image 
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces&auto=format" 
                        alt="Salina Gomez" 
                        width={80} 
                        height={80} 
                        className="rounded-full object-cover" 
                      />
                    </div>
                    <h4 className="text-black font-medium text-lg tracking-tight">Salina Gomez</h4>
                    <p className="text-black/70 text-[10px] uppercase tracking-widest font-normal mt-1">Premium Member</p>
                  </div>

                  <div className="mt-6 flex flex-col gap-2">
                    <Link href="/settings" onClick={() => setProfileOpen(false)} className="w-full flex items-center gap-3 p-3 rounded-sm cursor-pointer bg-black/5 hover:bg-black/10 text-black/60 hover:text-black font-medium transition-all text-sm group">
                      <div className="w-8 h-8 rounded-xl bg-black/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Settings size={14} />
                      </div>
                      {t('navbar.settings')}
                    </Link>
                    <button className="w-full flex items-center gap-3 p-3 rounded-sm cursor-pointer bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 font-medium transition-all text-sm group">
                      <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/10 transition-colors">
                        <LogOut size={14} />
                      </div>
                      {t('navbar.sign_out')}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Hamburger Full Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[110] bg-[#111111] flex flex-col px-6 pt-6 pb-24 overflow-y-auto w-full h-[100dvh]"
          >
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/10">
              <span className="text-white font-medium tracking-widest text-lg">MENU</span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-red-500/20 hover:text-red-400 transition-colors"
              >
                  <X size={20} />
              </button>
            </div>
            <div className="flex flex-col gap-6">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "text-3xl font-medium transition-colors w-fit border-b-2 py-1",
                      isActive ? "text-primary border-primary" : "text-white/40 hover:text-white border-transparent"
                    )}
                  >
                      {item.name}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
