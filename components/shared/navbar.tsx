'use client';

import { logout } from '@/features/auth/authSlice';
import { useGetUnReadCountQuery } from '@/features/notification/notificationApi';
import { useGetMyProfileQuery } from '@/features/profileAndSettings/profileApi';
import { cn } from '@/lib/utils';
import { baseURL } from '@/utils/BaseURL';
import { baseApi } from '@/utils/apiBaseQuery';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, ChevronDown, Globe, LogOut, Menu, Settings, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';


const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
];

export function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { token, user } = useSelector((state: any) => state.auth);
  const [mounted, setMounted] = useState(false);
  const { data: unreadData, refetch: refetchUnreadCount } = useGetUnReadCountQuery(undefined, { skip: !token });
  const unreadCount = unreadData?.data?.unreadCount || 0;

  const { data: profileResponse } = useGetMyProfileQuery(undefined, { skip: !token });
  const profile = profileResponse?.data || user;

  const displayName = profile?.fullName || profile?.name || user?.fullName || user?.name || "User";
  const displayRole = profile?.role || user?.role || "Premium Member";
  const rawImage = profile?.image || profile?.profileImage || profile?.avatar || profile?.photoURL || user?.image || user?.profileImage || user?.avatar || user?.photoURL;

  const [imageError, setImageError] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [rawImage]);

  const fallbackAvatar = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces&auto=format";

  const getImageUrl = (img?: string | null) => {
    if (!img) return fallbackAvatar;
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    return `${baseURL}${img.startsWith("/") ? "" : "/"}${img}`;
  };

  const avatarUrl = imageError ? fallbackAvatar : getImageUrl(rawImage);

  const [currentLangCode, setCurrentLangCode] = useState('en');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
    if (match && match[1]) {
      setCurrentLangCode(match[1]);
    }
  }, []);

  // Real-time notifications and chat list updates socket integration
  useEffect(() => {
    if (!token || !user) return;

    const myId = profile?._id || profile?.id || user?._id || user?.id;
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
  }, [token, user, profile, dispatch, refetchUnreadCount]);

  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const profileRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const confirmLogout = () => {
    setShowLogoutModal(false);
    dispatch(logout());
    toast.success('Logged out successfully');
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

          {!mounted ? (
            <div className="w-11 h-11" />
          ) : token ? (
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
                  className="w-11 h-11 rounded-full border-2 border-white/20 overflow-hidden cursor-pointer relative hover:border-primary/50 transition-all shadow-lg ring-offset-2 ring-offset-black bg-black/20"
                >
                  <Image
                    src={avatarUrl}
                    alt={displayName}
                    fill
                    sizes="44px"
                    className="object-cover"
                    onError={() => setImageError(true)}
                  />
                </motion.button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.9 }}
                      transition={{ duration: 0.2, type: "spring", damping: 20, stiffness: 300 }}
                      className="absolute top-13 right-0 w-64 bg-white backdrop-blur-2xl rounded-2xl overflow-hidden shadow-2xl border border-gray-100 p-5 z-[101]"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="relative w-20 h-20 rounded-full p-1 border-2 border-primary/30 shadow-md mb-3 flex items-center justify-center bg-orange-50/20">
                          <div className="relative w-full h-full rounded-full overflow-hidden">
                            <Image
                              src={avatarUrl}
                              alt={displayName}
                              fill
                              sizes="80px"
                              className="object-cover"
                              onError={() => setImageError(true)}
                              priority
                            />
                          </div>
                        </div>
                        <h4 className="text-black font-semibold text-base tracking-tight truncate max-w-[200px]">{displayName}</h4>
                        <p className="text-black/60 text-[10px] uppercase tracking-widest font-medium mt-0.5">{displayRole}</p>
                      </div>

                      <div className="mt-5 flex flex-col gap-2">
                        <Link href="/settings" onClick={() => setProfileOpen(false)} className="w-full flex items-center gap-3 p-3 rounded-xl cursor-pointer bg-black/5 hover:bg-black/10 text-black/70 hover:text-black font-medium transition-all text-sm group">
                          <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Settings size={14} />
                          </div>
                          Settings
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setProfileOpen(false);
                            setShowLogoutModal(true);
                          }}
                          className="w-full flex items-center cursor-pointer gap-3 p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-600 font-medium transition-all text-sm group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-red-500/10 cursor-pointer flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
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
              {mounted && !token && (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-3xl font-medium text-primary mt-4"
                >
                  Sign In
                </Link>
              )}
              {mounted && token && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowLogoutModal(true);
                  }}
                  className="text-3xl font-medium text-red-400 mt-4 text-left cursor-pointer"
                >
                  Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowLogoutModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 overflow-hidden z-10 border border-gray-100 text-center"
            >
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100 cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <div className="mx-auto w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-500 mb-4 shadow-sm">
                <LogOut size={24} className="translate-x-0.5" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-2">
                Sign Out
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                Are you sure you want to sign out? You will need to log in again to access your account.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(false)}
                  className="w-full py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmLogout}
                  className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium text-sm shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  Yes, Sign Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
}
