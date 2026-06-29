import { useState } from 'react';
import { AlertTriangle, Info, CheckCircle2, XCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockPlanQueues } from '@/lib/mock/mockPlans';
import { useAccountStore } from '@/stores/account.store';
import { PlanStatus } from '@/types/plan.types';

type AlertType = 'expiry' | 'info' | 'success' | 'error';

interface AlertBannerProps {
  type: AlertType;
  message: string;
  ctaLabel?: string;
  ctaHref?: string;
  dismissible?: boolean;
}

const alertConfig: Record<
  AlertType,
  {
    icon: React.ComponentType<{ className?: string }>;
    containerClass: string;
    iconClass: string;
  }
> = {
  expiry: {
    icon: AlertTriangle,
    containerClass: 'bg-[#F4A261]/10 border border-[#F4A261]',
    iconClass: 'text-[#F4A261]',
  },
  info: {
    icon: Info,
    containerClass: 'bg-blue-50 border border-blue-200',
    iconClass: 'text-blue-500',
  },
  success: {
    icon: CheckCircle2,
    containerClass: 'bg-[#E6F7F1] border border-[#00A86B]/30',
    iconClass: 'text-[#00A86B]',
  },
  error: {
    icon: XCircle,
    containerClass: 'bg-[#E63946]/10 border border-[#E63946]/30',
    iconClass: 'text-[#E63946]',
  },
};

export function AlertBanner({
  type,
  message,
  ctaLabel,
  ctaHref,
  dismissible = false,
}: AlertBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const { activeAccountId } = useAccountStore();
  const accountId = activeAccountId || 'acc-001';

  // Smart suppression: if type is 'expiry' and a WAITING plan exists, render nothing
  
  if (type === 'expiry') {
    const planQueue = mockPlanQueues[accountId] || [];
    const hasWaitingPlan = planQueue.some((pq) => pq.status === PlanStatus.WAITING);
    if (hasWaitingPlan) return null;
  }

  if (dismissed) return null;

  const { icon: Icon, containerClass, iconClass } = alertConfig[type];

  return (
    <div
      className={`flex items-start gap-3 px-4 py-4 rounded-2xl ${containerClass} animate-fade-up`}
      role="alert"
      aria-live="polite"
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconClass}`} aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#0D1B2E]">{message}</p>
        {ctaLabel && ctaHref && (
          <Link
            to={ctaHref}
            className="inline-block mt-2 text-sm font-semibold text-[#0F2B5B] underline underline-offset-2 hover:text-[#1A3F7A] transition-colors"
          >
            {ctaLabel} →
          </Link>
        )}
      </div>
      {dismissible && (
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss alert"
          className="p-1 rounded-lg text-[#64748B] hover:text-[#0D1B2E] hover:bg-black/5 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#0F2B5B] focus-visible:outline-none"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
