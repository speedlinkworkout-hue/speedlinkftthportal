import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-6">
      <div>
        <h2 className="font-heading font-semibold text-2xl lg:text-[28px] text-[#0D1B2E] leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-[#64748B]">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
