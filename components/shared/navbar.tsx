'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, ChevronDown, Globe, LogOut, Settings, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/features/auth/authSlice';
import { useRouter } from 'next/navigation';
import { useGetUnReadCountQuery } from '@/features/notification/notificationApi';
import { io } from 'socket.io-client';
import { baseURL } from '@/utils/BaseURL';
import { baseApi } from '@/utils/apiBaseQuery';


const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
];

export function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { token, user } = useSelector((state: any) => state.auth);
  const { data: unreadData, refetch: refetchUnreadCount } = useGetUnReadCountQuery(undefined, { skip: !token });
  const unreadCount = unreadData?.data?.unreadCount || 0;

  const [currentLangCode, setCurrentLangCode] = useState('fr');

  useEffect(() => {
    const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
    if (match && match[1]) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentLangCode(match[1]);
    }
  }, []);

  // Real-time notifications and chat list updates socket integration
  useEffect(() => {
    if (!token || !user) return;

    const myId = user?._id || user?.id;
    if (!myId) return;

    // Connect to the /notifications socket namespace
    const socketInstance = io(`${baseURL}/notifications`, {
      auth: {
        token: token
      },
      query: {
        token: token
      },
      extraHeaders: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    socketInstance.on('connect', () => {
      console.log('Successfully connected to notifications socket');
    });

    // Listen for real-time user notification events
    socketInstance.on(`notification::${myId}`, (data: any) => {
      console.log('Real-time notification received:', data);
      
      // Refresh the global unread count badge in navbar
      refetchUnreadCount();
      
      // Instantly trigger refetch of all notifications queries currently rendered on any page
      dispatch(baseApi.util.invalidateTags(['notification']));
    });

    // Listen for real-time chat list update events
    socketInstance.on(`chatListUpdate::${myId}`, (data: any) => {
      console.log('Real-time chat list update received:', data);
      
      // Instantly trigger refetch of chat details / lists currently rendered on any page
      dispatch(baseApi.util.invalidateTags(['Chat']));
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from notifications socket');
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [token, user, dispatch, refetchUnreadCount]);

  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const profileRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    dispatch(logout());
    setProfileOpen(false);
    router.push('/login');
  };

  const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'Orders', href: '/orders' },
    { name: 'History', href: '/history' },
    { name: 'Chat', href: '/chat' },
    { name: 'Contact', href: '/contact' },
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
    if (typeof window !== 'undefined' && window.__applyTranslate) {
      window.__applyTranslate(code);
      setCurrentLangCode(code);
    }
    setLangOpen(false);
  };

  const currentLang = languages.find((l) => l.code === currentLangCode) || languages[0];

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
            <span className="text-white font-medium text-xs tracking-widest uppercase notranslate">{currentLang.code}</span>
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
                      currentLangCode === lang.code
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
            const requiresAuth = ['/orders', '/history', '/chat'].includes(item.href);

            const handleNavClick = (e: React.MouseEvent) => {
              if (requiresAuth && !token) {
                e.preventDefault();
                router.push('/login');
              }
            };

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleNavClick}
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

          {token ? (
            <>
              <Link href="/notifications">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden md:flex w-11 h-11 items-center justify-center rounded bg-black/10 backdrop-blur-xs border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all cursor-pointer relative"
                >
                  <Bell size={26} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-black animate-in zoom-in">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </motion.button>
              </Link>

              <div ref={profileRef} className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-11 h-11 rounded-full border-2 border-white/10 overflow-hidden cursor-pointer relative hover:border-primary/50 transition-all shadow-lg ring-offset-2 ring-offset-black"
                >
                  <Image
                    src={user?.image || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces&auto=format"}
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
                        <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-primary/30 p-1">
                          <Image
                            src={user?.image || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces&auto=format"}
                            alt={user?.name || "User"}
                            width={80}
                            height={80}
                            className="rounded-full object-cover"
                          />
                        </div>
                        <h4 className="text-black font-medium text-lg tracking-tight">{user?.name || "User"}</h4>
                        <p className="text-black/70 text-[10px] uppercase tracking-widest font-normal mt-1">{user?.role || "Premium Member"}</p>
                      </div>

                      <div className="mt-6 flex flex-col gap-2">
                        <Link href="/settings" onClick={() => setProfileOpen(false)} className="w-full flex items-center gap-3 p-3 rounded-sm cursor-pointer bg-black/5 hover:bg-black/10 text-black/60 hover:text-black font-medium transition-all text-sm group">
                          <div className="w-8 h-8 rounded-xl bg-black/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Settings size={14} />
                          </div>
                          Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center cursor-pointer gap-3 p-3 rounded-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 font-medium transition-all text-sm group"
                        >
                          <div className="w-8 h-8 rounded-xl bg-red-500/10 cursor-pointer flex items-center justify-center group-hover:bg-red-500/10 transition-colors">
                            <LogOut size={14} />
                          </div>
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 h-11 px-6 border border-primary mt-1 rounded-sm bg-primary text-white font-normal cursor-pointer text-sm transition-all shadow-lg hover:bg-primary/90"
              >
                Sign In
              </motion.button>
            </Link>
          )}
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
                const requiresAuth = ['/orders', '/history', '/chat'].includes(item.href);

                const handleMobileNavClick = (e: React.MouseEvent) => {
                  if (requiresAuth && !token) {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    router.push('/login');
                  } else {
                    setMobileMenuOpen(false);
                  }
                };

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleMobileNavClick}
                    className={cn(
                      "text-3xl font-medium transition-colors w-fit border-b-2 py-1",
                      isActive ? "text-primary border-primary" : "text-white/40 hover:text-white border-transparent"
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
              {!token && (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-3xl font-medium text-primary mt-4"
                >
                  Sign In
                </Link>
              )}
              {token && (
                <button
                  onClick={handleLogout}
                  className="text-3xl font-medium text-red-400 mt-4 text-left"
                >
                  Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
