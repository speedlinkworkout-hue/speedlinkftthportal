import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Wallet,
  UserCircle,
  MessageSquare,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { UserRole } from '@/types/user.types';

interface BottomNavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  allowedRoles?: UserRole[];
}

const bottomNavItems: BottomNavItem[] = [
  { label: 'Home',    href: '/dashboard', icon: LayoutDashboard },
  { label: 'Plans',   href: '/plans',     icon: Layers },
  { label: 'Wallet',  href: '/wallet',    icon: Wallet },
  { label: 'Support', href: '/support/tickets', icon: MessageSquare, allowedRoles: [UserRole.CUSTOMER] },
  { label: 'Account', href: '/account/settings', icon: UserCircle },
];

export function BottomNav() {
  const location = useLocation();
  const { user } = useAuthStore();

  return (
    <nav
      aria-label="Bottom navigation"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#E2E8F0] bg-white transition-colors duration-200 dark:border-gray-800 dark:bg-gray-900 lg:hidden pb-safe"
    >
      <div className="flex items-stretch">
        {bottomNavItems.filter(item => {
          // If no allowedRoles specified, show for all
          if (!item.allowedRoles) return true;
          // Otherwise, check if user's role is in allowedRoles
          return item.allowedRoles.includes(user?.role as UserRole);
        }).map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/dashboard'
              ? location.pathname === '/dashboard'
              : location.pathname.startsWith(item.href);

          return (
            <NavLink
              key={item.href}
              to={item.href}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={[
                'flex flex-col items-center justify-center flex-1 py-2 px-1 gap-0.5 min-h-[56px] transition-all duration-200 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0F2B5B]',
                isActive ? 'text-[#00A86B]' : 'text-[#94A3B8] dark:text-gray-500 dark:hover:text-gray-200',
              ].join(' ')}
            >
              {isActive && (
                <span
                  className="absolute top-0 left-2 right-2 h-0.5 bg-[#00A86B] rounded-full"
                  aria-hidden="true"
                />
              )}
              <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
