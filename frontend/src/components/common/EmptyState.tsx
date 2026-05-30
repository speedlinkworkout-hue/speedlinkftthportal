import { type LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  cta?: {
    label: string;
    href: string;
  };
}

export function EmptyState({ icon: Icon, title, description, cta }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div
        className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4"
        aria-hidden="true"
      >
        <Icon className="w-8 h-8 text-slate-300" />
      </div>
      <h3 className="font-heading font-semibold text-slate-600 text-base mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-[280px] leading-relaxed">{description}</p>
      {cta && (
        <Link
          to={cta.href}
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0F2B5B] text-white text-sm font-semibold hover:bg-[#1A3F7A] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#0F2B5B] focus-visible:outline-none"
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}
