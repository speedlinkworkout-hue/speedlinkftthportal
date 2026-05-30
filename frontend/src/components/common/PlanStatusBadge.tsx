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
    classes: 'bg-[#E6F7F1] text-[#00A86B] border border-[#00A86B]/30',
  },
  [PlanStatus.WAITING]: {
    label: 'Waiting',
    icon: Clock,
    classes: 'bg-amber-50 text-amber-600 border border-amber-300',
  },
  [PlanStatus.USED]: {
    label: 'Used',
    icon: Archive,
    classes: 'bg-slate-100 text-slate-500 border border-slate-300',
  },
  [PlanStatus.PAUSED]: {
    label: 'Paused',
    icon: PauseCircle,
    classes: 'bg-blue-50 text-blue-500 border border-blue-300',
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
