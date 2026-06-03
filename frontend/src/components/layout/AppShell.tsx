import { ReactNode, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
const LogoSrc = '/speedlink-logo.png';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { BottomNav } from './BottomNav';

export function AppShell({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  const currentPath = location.pathname;

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [currentPath]);

  return (
    <div className="min-h-screen flex bg-[#F5F7FA]">
      {/* ── Desktop Sidebar ── */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* ── Mobile Drawer Overlay ── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer panel */}
          <div className="absolute left-0 top-0 bottom-0 w-[280px] flex flex-col bg-[#0F2B5B] shadow-2xl animate-fade-up">
            <button
              onClick={() => setDrawerOpen(false)}
              aria-label="Close navigation menu"
              className="absolute top-4 right-4 z-50 p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#00A86B] focus-visible:outline-none"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
            {/* Sidebar content in drawer */}
            <div className="flex-1 overflow-y-auto">
              <Sidebar />
            </div>
          </div>
        </div>
      )}

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuOpen={() => setDrawerOpen(true)} />
        <main
          id="main-content"
          className="flex-1 overflow-y-auto pb-[72px] lg:pb-0"
          aria-label="Page content"
        >
          {children}
        </main>
      </div>

      {/* ── Mobile Bottom Navigation ── */}
      <BottomNav />
    </div>
  );
}
