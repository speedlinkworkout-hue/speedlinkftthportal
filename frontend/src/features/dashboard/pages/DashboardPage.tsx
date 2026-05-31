import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  RefreshCw,
  ArrowDown,
  ArrowUp,
  ShoppingCart,
  CreditCard,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { PlanStatusBadge } from '@/components/common/PlanStatusBadge';
import { AlertBanner } from '@/components/common/AlertBanner';
import { WalletBalanceWidget } from '@/components/dashboard/WalletBalanceWidget';
import { mockPlanQueue, mockAvailablePlans } from '@/lib/mock/mockPlans';
import { mockMonthlyUsage, mockTodayUsage } from '@/lib/mock/mockUsage';
import { mockWallet } from '@/lib/mock/mockWallet';
import { PlanStatus } from '@/types/plan.types';


const activePlanQueue = mockPlanQueue.find((pq) => pq.status === PlanStatus.ACTIVE);
const waitingPlanQueue = mockPlanQueue.find((pq) => pq.status === PlanStatus.WAITING);
const activePlan = activePlanQueue
  ? mockAvailablePlans.find((p) => p.id === activePlanQueue.planId)
  : null;
const waitingPlan = waitingPlanQueue
  ? mockAvailablePlans.find((p) => p.id === waitingPlanQueue.planId)
  : null;

function getDaysRemaining(endDate?: string): number {
  if (!endDate) return 0;
  const now = new Date();
  const end = new Date(endDate);
  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomBarTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0D1B2E] text-white px-3 py-2 rounded-xl text-xs shadow-lg">
      <div className="font-semibold mb-0.5">{label}</div>
      <div className="font-mono">{payload[0].value.toFixed(1)} GB</div>
    </div>
  );
}

interface ActivityItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  description: string;
  time: string;
}

const recentActivity: ActivityItem[] = [
  {
    id: 'act-1',
    icon: ShoppingCart,
    iconBg: 'bg-[#E6F7F1]',
    description: 'Plan purchased — 10 Mbps Unlimited',
    time: '3 days ago',
  },
  {
    id: 'act-2',
    icon: CreditCard,
    iconBg: 'bg-blue-50',
    description: 'Wallet topped up — ₦20,000',
    time: '5 days ago',
  },
  {
    id: 'act-3',
    icon: MessageSquare,
    iconBg: 'bg-amber-50',
    description: 'Ticket #TKT-0042 updated — In Progress',
    time: '1 day ago',
  },
  {
    id: 'act-4',
    icon: ShoppingCart,
    iconBg: 'bg-[#E6F7F1]',
    description: 'Plan queued — 5 Mbps Home',
    time: '3 days ago',
  },
  {
    id: 'act-5',
    icon: CreditCard,
    iconBg: 'bg-blue-50',
    description: 'Wallet topped up — ₦5,000',
    time: '7 days ago',
  },
];

const recentMonthlyUsage = mockMonthlyUsage.slice(-6);

export function DashboardPage() {
  const { user } = useAuthStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const daysRemaining = getDaysRemaining(activePlanQueue?.endDate);
  const planDuration = activePlan?.durationDays ?? 30;
  const ringPct = planDuration > 0 ? daysRemaining / planDuration : 0;
  const ringCircumference = 2 * Math.PI * 28; // r=28
  const ringOffset = ringCircumference * (1 - ringPct);

  function handleRefresh() {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  }

  return (
    <div className="p-5 lg:p-8 space-y-6 max-w-screen-xl mx-auto">

      {/* ── Row 1: Welcome Banner ── */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0F2B5B] to-[#1A3F7A] px-6 py-6 lg:px-8 text-white animate-fade-up">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-heading font-bold text-xl lg:text-2xl text-white">
              {getGreeting()}, {user?.firstName ?? 'there'} 👋
            </h2>
            <p className="text-white/70 text-sm mt-1">
              {new Date().toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
              {' · '}
              {daysRemaining > 7
                ? 'Your account is in good standing'
                : `Plan expires in ${daysRemaining} days`}
            </p>
          </div>
          <Link
            to="/plans"
            id="welcome-buy-plan-btn"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00A86B] text-white text-sm font-semibold hover:bg-[#009960] transition-all duration-200 shrink-0 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
          >
            <ShoppingCart className="w-4 h-4" aria-hidden="true" />
            Buy a Plan
          </Link>
        </div>
      </div>

      {/* ── Row 2: Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        {/* Card 1: Active Plan */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5 flex flex-col gap-4 animate-fade-up animate-delay-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                Active Plan
              </p>
              <p className="font-heading font-semibold text-[#0D1B2E] text-base leading-tight">
                {activePlan?.name ?? 'No active plan'}
              </p>
            </div>
            {activePlanQueue && (
              <PlanStatusBadge status={activePlanQueue.status} />
            )}
          </div>

          {/* Circular days ring */}
          <div className="flex items-center gap-4">
            <div className="relative w-[72px] h-[72px] shrink-0" aria-label={`${daysRemaining} days remaining`}>
              <svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90" aria-hidden="true">
                <circle cx="36" cy="36" r="28" fill="none" stroke="#E2E8F0" strokeWidth="6" />
                <circle
                  cx="36" cy="36" r="28" fill="none"
                  stroke={daysRemaining > 7 ? '#00A86B' : '#F4A261'}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringOffset}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono font-bold text-[#0D1B2E] text-lg leading-none">
                  {daysRemaining}
                </span>
                <span className="text-[9px] text-[#94A3B8] leading-none">days</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-[#64748B]">Expires</p>
              <p className="text-sm font-semibold text-[#0D1B2E]">
                {formatDate(activePlanQueue?.endDate)}
              </p>
            </div>
          </div>

          <Link
            to="/plans"
            id="active-plan-buy-btn"
            className="flex items-center justify-center gap-1.5 py-2 rounded-full border border-[#E2E8F0] text-[#0F2B5B] text-sm font-semibold hover:bg-[#0F2B5B] hover:text-white hover:border-[#0F2B5B] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#0F2B5B] focus-visible:outline-none"
          >
            <ShoppingCart className="w-3.5 h-3.5" aria-hidden="true" />
            Buy New Plan
          </Link>
        </div>

        {/* Card 2: Data Usage Today */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5 flex flex-col gap-4 animate-fade-up animate-delay-150">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
              Data Usage — Today
            </p>
            <button
              onClick={handleRefresh}
              aria-label="Refresh usage data"
              className="p-1.5 rounded-lg text-[#64748B] hover:bg-[#F5F7FA] hover:text-[#0F2B5B] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#0F2B5B] focus-visible:outline-none"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
            </button>
          </div>

          <div className="flex gap-6">
            <div>
              <div className="flex items-center gap-1 text-[#00A86B] mb-0.5">
                <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="text-xs font-medium text-[#64748B]">Download</span>
              </div>
              <span
                className="font-mono font-bold text-2xl text-[#0D1B2E]"
                aria-label={`Download: ${mockTodayUsage.downloadGb} GB`}
              >
                {mockTodayUsage.downloadGb}
              </span>
              <span className="text-xs text-[#94A3B8] ml-1">GB</span>
            </div>
            <div>
              <div className="flex items-center gap-1 text-[#00C2B2] mb-0.5">
                <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="text-xs font-medium text-[#64748B]">Upload</span>
              </div>
              <span
                className="font-mono font-bold text-2xl text-[#0D1B2E]"
                aria-label={`Upload: ${mockTodayUsage.uploadGb} GB`}
              >
                {mockTodayUsage.uploadGb}
              </span>
              <span className="text-xs text-[#94A3B8] ml-1">GB</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
            {/* Live pulse dot */}
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#00A86B] animate-pulse-live shrink-0"
              aria-hidden="true"
            />
            Last updated {mockTodayUsage.lastUpdated}
          </div>
        </div>

        {/* Card 3: Wallet Balance */}
        <div className="animate-fade-up animate-delay-200">
          <WalletBalanceWidget balance={mockWallet.balanceNgn} variant="full" />
        </div>

        {/* Card 4: Queued Plan */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5 flex flex-col gap-4 animate-fade-up animate-delay-300">
          <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
            Queued Plan
          </p>
          {waitingPlan && waitingPlanQueue ? (
            <>
              <div>
                <p className="font-heading font-semibold text-[#0D1B2E] text-base">
                  {waitingPlan.name}
                </p>
                <p className="text-xs text-[#64748B] mt-1">
                  Activates when current plan expires
                </p>
              </div>
              <div>
                <PlanStatusBadge status={waitingPlanQueue.status} />
                <p className="text-xs text-[#64748B] mt-2">
                  Expected: {formatDate(waitingPlanQueue.startDate)}
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="font-medium text-[#0D1B2E] text-sm">No plan queued</p>
                <p className="text-xs text-[#94A3B8] mt-1">
                  Queue a plan to activate automatically when your current plan expires.
                </p>
              </div>
              <Link
                to="/plans"
                id="queue-plan-btn"
                className="flex items-center justify-center gap-1.5 py-2 rounded-full border border-[#00A86B]/30 text-[#00A86B] text-sm font-semibold hover:bg-[#E6F7F1] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#00A86B] focus-visible:outline-none"
              >
                Queue a Plan
              </Link>
            </>
          )}
        </div>
      </div>

      {/* ── Row 3: Chart + Activity ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Usage History Chart (8 cols) */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5 animate-fade-up animate-delay-400">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-heading font-semibold text-[#0D1B2E] text-base">
                Usage by Month
              </h3>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Total:{' '}
                <span className="font-mono font-semibold text-[#0D1B2E]">
                  {recentMonthlyUsage.reduce((s, d) => s + d.downloadGb, 0).toFixed(1)} GB
                </span>{' '}
                downloaded in 6 months
              </p>
            </div>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recentMonthlyUsage} barSize={28}>
                <CartesianGrid vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'Outfit' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'Outfit' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}GB`}
                  width={40}
                />
                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: '#F5F7FA' }} />
                <Bar
                  dataKey="downloadGb"
                  fill="#00A86B"
                  radius={[6, 6, 0, 0]}
                  aria-label="Monthly download usage"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Feed (4 cols) */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5 flex flex-col animate-fade-up animate-delay-500">
          <h3 className="font-heading font-semibold text-[#0D1B2E] text-base mb-4">
            Recent Activity
          </h3>
          <div className="flex-1 space-y-3 overflow-y-auto scrollbar-thin">
            {recentActivity.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0`}
                    aria-hidden="true"
                  >
                    <Icon className="w-4 h-4 text-[#0F2B5B]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#0D1B2E] leading-snug">{item.description}</p>
                    <p className="text-xs text-[#94A3B8] mt-0.5">{item.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <Link
            to="/wallet"
            className="mt-4 flex items-center justify-center gap-1 py-2.5 text-xs font-semibold text-[#64748B] hover:text-[#0F2B5B] border-t border-[#E2E8F0] pt-4 transition-colors"
          >
            View all activity
            <ChevronRight className="w-3 h-3" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* ── Row 4: Alert Banner (conditional) ── */}
      {daysRemaining <= 7 && (
        <div className="animate-fade-up animate-delay-600">
          <AlertBanner
            type="expiry"
            message={`Your plan expires in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}. Renew now to avoid interruption.`}
            ctaLabel="Buy a Plan"
            ctaHref="/plans"
            dismissible
          />
        </div>
      )}
    </div>
  );
}
