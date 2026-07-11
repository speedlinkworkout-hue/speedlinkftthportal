import { useLocation, Link } from 'react-router-dom';
const LogoSrc = '/speedlink-logo.png';
import { useAuthStore } from '@/stores/auth.store';
import { MultiAccountSwitcher } from '@/components/common/MultiAccountSwitcher';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const pageTitles: Record<string, string> = {
  '/dashboard':       'Dashboard',
  '/plans':           'My Plans',
  '/usage':           'Usage',
  '/wallet':          'Wallet & Billing',
  '/support/tickets': 'My Tickets',
  '/support/queue':   'Ticket Queue',

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
      className="relative sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#E2E8F0] bg-white px-4 transition-colors duration-200 dark:border-gray-800 dark:bg-gray-900 lg:px-6"
      role="banner"
    >
      {/* Left: hamburger (mobile) + page title */}
      <div className="flex items-center gap-3">
        <button
          id="mobile-menu-btn"
          onClick={onMenuOpen}
          aria-label="Open navigation menu"
          className="rounded-xl p-2 text-[#64748B] transition-all duration-200 hover:bg-[#F5F7FA] hover:text-[#0F2B5B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2B5B] dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white lg:hidden"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <rect y="3"  width="20" height="2" rx="1" />
            <rect y="9"  width="14" height="2" rx="1" />
            <rect y="15" width="20" height="2" rx="1" />
          </svg>
        </button>
        <h1 className="hidden font-heading text-lg font-semibold text-[#0D1B2E] dark:text-gray-100 lg:block">
          {title}
        </h1>
        {/* Mobile: centered logo placeholder (rendered in AppShell mobile topbar) */}
      </div>

      {/* Right: account switcher + notifications + avatar */}
      <div className="flex items-center gap-2 lg:gap-3">
        <div className="hidden lg:block">
          <MultiAccountSwitcher />
        </div>

        <ThemeToggle />

        {/* User avatar */}
        <Link
          to="/account/settings"
          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#0F2B5B] text-xs font-semibold text-white dark:bg-primary transition-transform hover:scale-105"
          title={user ? `${user.firstName} ${user.lastName}` : 'User'}
          aria-label="Account Settings"
        >
          {initials}
        </Link>
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
