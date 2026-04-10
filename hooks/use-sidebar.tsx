'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type SidebarContextType = {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  setCollapsed: (collapsed: boolean) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setIsMounted(true);
    try {
      const saved = localStorage.getItem('sidebar-collapsed');
      if (saved !== null) {
        setIsCollapsed(JSON.parse(saved));
      } else if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    } catch {
      // ignore
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const setCollapsed = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    try {
      localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed));
    } catch {
      // ignore
    }
  };

  const toggleSidebar = () => {
    setCollapsed(!isCollapsed);
  };

  // Prevent hydration mismatch on initial render
  if (!isMounted) {
    return <div className="invisible" />;
  }

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
