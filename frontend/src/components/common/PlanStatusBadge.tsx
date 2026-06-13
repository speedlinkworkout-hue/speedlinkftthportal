import { CheckCircle, Clock, Archive, PauseCircle } from 'lucide-react';
import { PlanStatus } from '@/types/plan.types';

interface PlanStatusBadgeProps {
  status: PlanStatus;
  className?: string;
}

const config: Record<
  PlanStatus,
  {
    label: string;
    icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
    classes: string;
  }
> = {
  [PlanStatus.ACTIVE]: {
    label: 'Active',
    icon: CheckCircle,
    classes: 'bg-[#E6F7F1] text-[#00A86B] border border-[#00A86B]/30 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-400/30',
  },
  [PlanStatus.WAITING]: {
    label: 'Waiting',
    icon: Clock,
    classes: 'bg-amber-50 text-amber-600 border border-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-400/30',
  },
  [PlanStatus.USED]: {
    label: 'Used',
    icon: Archive,
    classes: 'bg-slate-100 text-slate-500 border border-slate-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
  },
  [PlanStatus.PAUSED]: {
    label: 'Paused',
    icon: PauseCircle,
    classes: 'bg-blue-50 text-blue-500 border border-blue-300 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-400/30',
  },
};

export function PlanStatusBadge({ status, className = '' }: PlanStatusBadgeProps) {
  const { label, icon: Icon, classes } = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${classes} ${className}`}
      aria-label={`Plan status: ${label}`}
    >
      <Icon className="w-3 h-3" aria-hidden={true} />
      {label}
    </span>
  );
}
