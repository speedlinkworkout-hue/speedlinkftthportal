import { useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';
import LogoSrc from '../../../../speedlink logo.png';
import { useAuthStore } from '@/stores/auth.store';
import { MultiAccountSwitcher } from '@/components/common/MultiAccountSwitcher';

const pageTitles: Record<string, string> = {
  '/dashboard':       'Dashboard',
  '/plans':           'My Plans',
  '/usage':           'Usage',
  '/wallet':          'Wallet & Billing',

  '/account/settings':'Account Settings',
};

function getPageTitle(pathname: string): string {
  // Exact match first
  if (pageTitles[pathname]) return pageTitles[pathname];
  // Prefix match for dynamic routes
  for (const [key, value] of Object.entries(pageTitles)) {
    if (pathname.startsWith(key) && key !== '/') return value;
  }
  return 'Portal';
}

interface TopbarProps {
  onMenuOpen: () => void;
}

export function Topbar({ onMenuOpen }: TopbarProps) {
  const location = useLocation();
  const { user } = useAuthStore();
  const title = getPageTitle(location.pathname);
  const initials = user ? `${user.firstName[0]}${user.lastName[0]}` : 'U';

  return (
    <header
      className="h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30 relative"
      role="banner"
    >
      {/* Left: hamburger (mobile) + page title */}
      <div className="flex items-center gap-3">
        <button
          id="mobile-menu-btn"
          onClick={onMenuOpen}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 rounded-xl text-[#64748B] hover:bg-[#F5F7FA] hover:text-[#0F2B5B] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#0F2B5B] focus-visible:outline-none"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <rect y="3"  width="20" height="2" rx="1" />
            <rect y="9"  width="14" height="2" rx="1" />
            <rect y="15" width="20" height="2" rx="1" />
          </svg>
        </button>
        <h1 className="font-heading font-semibold text-lg text-[#0D1B2E] hidden lg:block">
          {title}
        </h1>
        {/* Mobile: centered logo placeholder (rendered in AppShell mobile topbar) */}
      </div>

      {/* Right: account switcher + notifications + avatar */}
      <div className="flex items-center gap-2 lg:gap-3">
        <div className="hidden lg:block">
          <MultiAccountSwitcher />
        </div>

        {/* Notification bell */}
        <button
          id="notification-bell"
          aria-label="Notifications (2 unread)"
          className="relative p-2 rounded-xl text-[#64748B] hover:bg-[#F5F7FA] hover:text-[#0F2B5B] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#0F2B5B] focus-visible:outline-none"
        >
          <Bell className="w-5 h-5" aria-hidden="true" />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E63946] rounded-full border-2 border-white"
            aria-hidden="true"
          />
        </button>

        {/* User avatar */}
        <div
          className="w-8 h-8 rounded-full bg-[#0F2B5B] flex items-center justify-center text-white text-xs font-semibold cursor-pointer shrink-0"
          title={user ? `${user.firstName} ${user.lastName}` : 'User'}
          aria-hidden="true"
        >
          {initials}
        </div>
      </div>

      {/* Mobile centered logo */}
      <a
        href="https://speedlinktraining.com/"
        target="_blank"
        rel="noreferrer noopener"
        className="lg:hidden absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity hover:opacity-90"
        aria-label="Visit Speedlink Training"
      >
        <img src={LogoSrc} alt="Speedlink" className="h-20 object-contain" />
      </a>
    </header>
  );
}
