import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Wallet,
  UserCircle,
} from 'lucide-react';

interface BottomNavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const bottomNavItems: BottomNavItem[] = [
  { label: 'Home',    href: '/dashboard', icon: LayoutDashboard },
  { label: 'Plans',   href: '/plans',     icon: Layers },
  { label: 'Wallet',  href: '/wallet',    icon: Wallet },

  { label: 'Account', href: '/account/settings', icon: UserCircle },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav
      aria-label="Bottom navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E2E8F0] lg:hidden pb-safe"
    >
      <div className="flex items-stretch">
        {bottomNavItems.map((item) => {
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
                isActive ? 'text-[#00A86B]' : 'text-[#94A3B8]',
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
