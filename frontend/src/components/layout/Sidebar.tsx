import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Activity,
  Wallet,
  Settings,
  LogOut,
} from 'lucide-react';
import LogoSrc from '../../../../speedlink logo.png';
import { useAuthStore } from '@/stores/auth.store';
import { WalletBalanceWidget } from '@/components/dashboard/WalletBalanceWidget';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { label: 'Dashboard',       href: '/dashboard',        icon: LayoutDashboard },
  { label: 'My Plans',        href: '/plans',            icon: Layers },
  { label: 'Usage',           href: '/usage',            icon: Activity },
  { label: 'Wallet & Billing',href: '/wallet',           icon: Wallet },

  { label: 'Account Settings',href: '/account/settings', icon: Settings },
];

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`
    : 'U';
  const accessLabel = user?.role ? user.role : 'CUSTOMER';

  return (
    <aside
      className="w-[260px] min-h-screen flex flex-col bg-[#0F2B5B] text-white shrink-0"
      aria-label="Primary navigation"
    >
      {/* Logo */}
      <a
        href="https://speedlinktraining.com/"
        target="_blank"
        rel="noreferrer noopener"
        className="flex items-center gap-2 px-4 py-3 border-b border-white/10 transition-opacity hover:opacity-90"
        aria-label="Visit Speedlink Training"
      >
        <img src={LogoSrc} alt="Speedlink" className="w-28 h-28 object-contain" />
        <div>
          <div className="font-heading font-700 text-white text-base leading-tight">Speedlink</div>
          <div className="text-white/50 text-[10px] font-mono tracking-widest uppercase">FTTH Portal</div>
        </div>
      </a>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-thin" aria-label="Main navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/dashboard'
              ? location.pathname === '/dashboard'
              : location.pathname.startsWith(item.href);

          return (
            <NavLink
              key={item.href}
              to={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={[
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ease-out relative',
                isActive
                  ? 'bg-white/10 text-white border-l-2 border-[#00A86B] pl-[10px]'
                  : 'text-white/60 hover:text-white hover:bg-white/5',
              ].join(' ')}
            >
              <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Wallet widget */}
      <div className="px-3 py-3 border-t border-white/10">
        <WalletBalanceWidget balance={23500} variant="compact" />
      </div>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl">
          <div
            className="w-8 h-8 rounded-full bg-[#00A86B] flex items-center justify-center text-white text-xs font-semibold shrink-0"
            aria-hidden="true"
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">
              {user ? `${user.firstName} ${user.lastName}` : 'User'}
            </div>
            <div className="text-xs text-white/50 truncate">{user?.email}</div>
            <div className="mt-1 inline-flex rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-white/80">
              Access: {accessLabel}
            </div>
          </div>
          <button
            onClick={logout}
            aria-label="Log out"
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#00A86B] focus-visible:outline-none"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  );
}
