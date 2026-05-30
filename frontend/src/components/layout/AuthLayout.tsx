import { ReactNode } from 'react';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(15,43,91,0.12),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(0,168,107,0.12),_transparent_32%),linear-gradient(180deg,_#F8FAFC_0%,_#EEF2F7_100%)]">
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
