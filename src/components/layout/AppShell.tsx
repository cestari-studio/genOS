'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import './AppShell.scss';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Routes that don't need the shell
  const publicRoutes = ['/login', '/signup', '/forgot-password', '/auth'];
  const isPublicRoute = publicRoutes.some(route => pathname?.startsWith(route));

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 672);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Load sidebar state
  useEffect(() => {
    const saved = localStorage.getItem('genos-sidebar-collapsed');
    if (saved !== null) {
      setSidebarCollapsed(saved === 'true');
    }
  }, []);

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <div className={`app-shell ${sidebarCollapsed ? 'app-shell--collapsed' : ''}`}>
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={(collapsed) => setSidebarCollapsed(collapsed)} 
      />
      
      <Header 
        onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      />
      
      <main className="app-shell__main">
        <div className="app-shell__content">
          {children}
        </div>
      </main>
      
      {/* Mobile Overlay */}
      {isMobile && mobileMenuOpen && (
        <div 
          className="app-shell__overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
