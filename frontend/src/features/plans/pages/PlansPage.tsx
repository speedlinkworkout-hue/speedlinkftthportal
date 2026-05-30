import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  Check,
  X,
  CheckCircle2,
  AlertCircle,
  MapPin,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PlanStatusBadge } from '@/components/common/PlanStatusBadge';
import { mockPlanQueue, mockAvailablePlans, mostPopularPlanId } from '@/lib/mock/mockPlans';
import { mockWallet } from '@/lib/mock/mockWallet';
import { Plan, PlanStatus } from '@/types/plan.types';
import { useToast } from '@/hooks/use-toast';


const activePQ = mockPlanQueue.find((pq) => pq.status === PlanStatus.ACTIVE);
const waitingPQ = mockPlanQueue.find((pq) => pq.status === PlanStatus.WAITING);
const usedPQs = mockPlanQueue.filter((pq) => pq.status === PlanStatus.USED);
const cardDelayClasses = ['animate-delay-100', 'animate-delay-150', 'animate-delay-200', 'animate-delay-300'];

function getPlanById(id: string) {
  return mockAvailablePlans.find((p) => p.id === id);
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getDaysRemaining(endDate?: string): number {
  if (!endDate) return 0;
  return Math.max(0, Math.ceil((new Date(endDate).getTime() - Date.now()) / 86400000));
}

// ──────────────────────────────────────────────────────────────────────────
// Buy Plan Modal
// ──────────────────────────────────────────────────────────────────────────
type ModalStep = 'confirm' | 'payment' | 'success';

interface BuyPlanModalProps {
  plan: Plan;
  onClose: () => void;
}

function BuyPlanModal({ plan, onClose }: BuyPlanModalProps) {
  const [step, setStep] = useState<ModalStep>('confirm');
  const { toast } = useToast();
  const balance = mockWallet.balanceNgn;
  const sufficient = balance >= plan.priceNgn;
  const shortfall = plan.priceNgn - balance;
  const hasActive = !!activePQ;

  function handleConfirmPurchase() {
    // Simulate API call
    setTimeout(() => {
      setStep('success');
      toast({
        title: hasActive ? 'Plan queued!' : 'Plan activated!',
        description: `${plan.name} has been ${hasActive ? 'queued' : 'activated'} on your account.`,
      });
    }, 600);
    setStep('payment');
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="buy-plan-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel — bottom sheet on mobile, centered dialog on desktop */}
      <div className="relative z-10 w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2E8F0]">
          <h2 id="buy-plan-modal-title" className="font-heading font-semibold text-[#0D1B2E] text-lg">
            {step === 'success' ? '🎉 Purchase Complete' : 'Buy Plan'}
          </h2>
          {step !== 'success' && (
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#0D1B2E] hover:bg-[#F5F7FA] transition-all duration-200"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="px-6 py-6">
          {/* Step 1: Confirm Plan */}
          {step === 'confirm' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0]">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-heading font-semibold text-[#0D1B2E]">{plan.name}</p>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      {plan.durationDays} days · {plan.speedMbps} Mbps ·{' '}
                      {plan.dataLimitGb === null ? 'Unlimited data' : `${plan.dataLimitGb} GB`}
                    </p>
                  </div>
                  <p className="font-mono font-bold text-[#0F2B5B] text-lg">
                    ₦{plan.priceNgn.toLocaleString()}
                  </p>
                </div>
              </div>

              {hasActive && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-sm text-amber-700">
                    You already have an active plan. This plan will be <strong>queued</strong> and
                    activate when your current plan expires.
                  </p>
                </div>
              )}

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#64748B]">Wallet balance</span>
                  <span className={`font-mono font-semibold ${sufficient ? 'text-[#00A86B]' : 'text-[#E63946]'}`}>
                    ₦{balance.toLocaleString()}
                  </span>
                </div>
                {!sufficient && (
                  <p className="text-xs text-[#E63946]">
                    Insufficient balance. Top up ₦{shortfall.toLocaleString()} more.
                  </p>
                )}
              </div>

              {sufficient ? (
                <button
                  id="confirm-plan-btn"
                  onClick={() => setStep('payment')}
                  className="w-full py-3 rounded-full bg-[#0F2B5B] text-white font-semibold hover:bg-[#1A3F7A] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#0F2B5B] focus-visible:outline-none"
                >
                  Continue
                </button>
              ) : (
                <Link
                  to="/wallet"
                  onClick={onClose}
                  className="block w-full py-3 rounded-full bg-[#F4A261] text-white font-semibold text-center hover:bg-[#e8924e] transition-all duration-200"
                >
                  Top Up to Buy
                </Link>
              )}
            </div>
          )}

          {/* Step 2: Payment Source */}
          {step === 'payment' && (
            <div className="space-y-5">
              <div>
                <p className="text-sm font-semibold text-[#0D1B2E] mb-3">Payment Source</p>
                <div className="p-4 rounded-xl border-2 border-[#00A86B] bg-[#E6F7F1] flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#0D1B2E]">Pay from Wallet</p>
                    <p className="text-xs text-[#64748B] font-mono">₦{balance.toLocaleString()} available</p>
                  </div>
                  <Check className="w-5 h-5 text-[#00A86B]" aria-hidden="true" />
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border-t border-[#E2E8F0]">
                <span className="text-sm text-[#64748B]">Total</span>
                <span className="font-mono font-bold text-[#0D1B2E] text-lg">
                  ₦{plan.priceNgn.toLocaleString()}
                </span>
              </div>

              <button
                id="confirm-purchase-btn"
                onClick={handleConfirmPurchase}
                className="w-full py-3 rounded-full bg-[#00A86B] text-white font-semibold hover:bg-[#009960] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#00A86B] focus-visible:outline-none"
              >
                Confirm Purchase
              </button>
              <button
                onClick={() => setStep('confirm')}
                className="w-full py-2 text-sm text-[#94A3B8] hover:text-[#64748B] transition-colors"
              >
                ← Back
              </button>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <div className="flex flex-col items-center text-center gap-5 py-4">
              <div className="w-16 h-16 rounded-full bg-[#E6F7F1] flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-[#00A86B]" aria-hidden="true" />
              </div>
              <div>
                <p className="font-heading font-semibold text-[#0D1B2E] text-lg">
                  {hasActive ? 'Plan Queued!' : 'Plan Activated!'}
                </p>
                <p className="text-sm text-[#64748B] mt-1">
                  {hasActive
                    ? `${plan.name} will activate when your current plan expires.`
                    : `${plan.name} is now active on your account.`}
                </p>
              </div>
              <button
                id="success-back-dashboard"
                onClick={onClose}
                className="w-full py-3 rounded-full bg-[#0F2B5B] text-white font-semibold hover:bg-[#1A3F7A] transition-all duration-200"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Plan Card
// ──────────────────────────────────────────────────────────────────────────
interface PlanCardProps {
  plan: Plan;
  isPopular?: boolean;
  onBuy: (plan: Plan) => void;
}

function PlanCard({ plan, isPopular, onBuy }: PlanCardProps) {
  const balance = mockWallet.balanceNgn;
  const sufficient = balance >= plan.priceNgn;
  const hasWaiting = !!waitingPQ;

  const features = [
    plan.dataLimitGb === null ? 'Unlimited Data' : `${plan.dataLimitGb} GB Data`,
    `${plan.speedMbps} Mbps Download`,
    `${Math.round(plan.speedMbps / 2)} Mbps Upload`,
    `${plan.durationDays}-day validity`,
  ];

  return (
    <div
      className={`bg-white rounded-2xl border ${isPopular ? 'border-2 border-[#00A86B]' : 'border-[#E2E8F0]'
        } shadow-sm p-5 flex flex-col gap-5 relative transition-all duration-200 hover:shadow-md`}
    >
      {isPopular && (
        <div className="absolute -top-3 right-4">
          <span className="px-3 py-1 rounded-full bg-[#00A86B] text-white text-xs font-bold shadow-sm">
            Most Popular
          </span>
        </div>
      )}

      <div>
        <h3 className="font-heading font-semibold text-[#0D1B2E] text-lg">{plan.name}</h3>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="font-mono font-bold text-[#0F2B5B] text-2xl">
            ₦{plan.priceNgn.toLocaleString()}
          </span>
          <span className="text-xs text-[#94A3B8]">/ {plan.durationDays} days</span>
        </div>
      </div>

      <ul className="space-y-2 flex-1" aria-label={`${plan.name} features`}>
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-[#64748B]">
            <Check className="w-4 h-4 text-[#00A86B] shrink-0" aria-hidden="true" />
            {f}
          </li>
        ))}
      </ul>

      <button
        id={`buy-plan-${plan.id}`}
        onClick={() => onBuy(plan)}
        className={[
          'w-full py-3 rounded-full font-semibold text-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#0F2B5B] focus-visible:outline-none',
          !sufficient
            ? 'bg-[#F4A261]/20 text-[#F4A261] border border-[#F4A261]/30 hover:bg-[#F4A261] hover:text-white'
            : hasWaiting
              ? 'border border-[#E2E8F0] text-[#0F2B5B] hover:bg-[#0F2B5B] hover:text-white'
              : 'bg-[#0F2B5B] text-white hover:bg-[#1A3F7A]',
        ].join(' ')}
      >
        {!sufficient
          ? 'Top Up to Buy'
          : hasWaiting
            ? 'Add to Queue'
            : `Buy Now — ₦${plan.priceNgn.toLocaleString()}`}
      </button>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Plans Page
// ──────────────────────────────────────────────────────────────────────────
type PlanFilter = 'All Plans' | 'Home' | 'Business';

export function PlansPage() {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [filter, setFilter] = useState<PlanFilter>('All Plans');

  const activePlan = activePQ ? getPlanById(activePQ.planId) : null;
  const waitingPlan = waitingPQ ? getPlanById(waitingPQ.planId) : null;

  const filters: PlanFilter[] = ['All Plans', 'Home', 'Business'];

  // Simulate filter (in real impl, would filter by customer group)
  const filteredPlans =
    filter === 'Business'
      ? mockAvailablePlans.filter((p) => p.speedMbps >= 20)
      : filter === 'Home'
        ? mockAvailablePlans.filter((p) => p.speedMbps < 20)
        : mockAvailablePlans;

  return (
    <div className="p-5 lg:p-8 max-w-screen-xl mx-auto space-y-8">
      <PageHeader title="My Plans" subtitle="Manage your plan queue and browse available plans." />

      {/* ── Section 1: Plan Queue Timeline ── */}
      <section aria-labelledby="queue-heading">
        <h2 id="queue-heading" className="font-heading font-semibold text-[#0D1B2E] text-base mb-4">
          Your Plan Queue
        </h2>

        {/* Desktop horizontal timeline */}
        <div className="hidden md:flex items-center gap-0">
          {/* Active node */}
          {activePlan && activePQ && (
            <div className="flex-1 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 rounded-full bg-[#00A86B] border-2 border-[#00A86B] shrink-0" aria-hidden="true" />
                <PlanStatusBadge status={activePQ.status} />
              </div>
              <p className="font-heading font-semibold text-[#0D1B2E]">{activePlan.name}</p>
              <p className="text-xs text-[#64748B] mt-1">
                Expires {formatDate(activePQ.endDate)} ·{' '}
                <span className="font-mono text-[#0D1B2E]">{getDaysRemaining(activePQ.endDate)}</span> days left
              </p>
            </div>
          )}

          {/* Arrow connector */}
          {activePQ && waitingPQ && (
            <div className="flex items-center px-3 text-[#E2E8F0]" aria-hidden="true">
              <div className="h-0.5 w-8 bg-[#E2E8F0]" />
              <ChevronDown className="w-4 h-4 rotate-[-90deg] shrink-0" />
            </div>
          )}

          {/* Waiting node */}
          {waitingPlan && waitingPQ && (
            <div className="flex-1 bg-white rounded-2xl border-2 border-dashed border-amber-300 p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 rounded-full border-2 border-dashed border-amber-400 shrink-0" aria-hidden="true" />
                <PlanStatusBadge status={waitingPQ.status} />
              </div>
              <p className="font-heading font-semibold text-[#0D1B2E] italic">{waitingPlan.name}</p>
              <p className="text-xs text-[#64748B] mt-1">
                Activates {formatDate(waitingPQ.startDate)}
              </p>
            </div>
          )}

          {!activePQ && (
            <div className="flex-1 bg-[#F5F7FA] rounded-2xl border border-dashed border-[#E2E8F0] p-5 text-center">
              <p className="text-sm text-[#94A3B8]">No active plan</p>
            </div>
          )}
        </div>

        {/* Mobile vertical stack */}
        <div className="flex md:hidden flex-col gap-3">
          {activePlan && activePQ && (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-4">
              <div className="flex items-center gap-2 mb-1">
                <PlanStatusBadge status={activePQ.status} />
              </div>
              <p className="font-heading font-semibold text-[#0D1B2E]">{activePlan.name}</p>
              <p className="text-xs text-[#64748B] mt-0.5">
                Expires {formatDate(activePQ.endDate)}
              </p>
            </div>
          )}
          {waitingPlan && waitingPQ && (
            <div className="bg-white rounded-2xl border-2 border-dashed border-amber-300 p-4">
              <div className="flex items-center gap-2 mb-1">
                <PlanStatusBadge status={waitingPQ.status} />
              </div>
              <p className="font-heading font-semibold text-[#0D1B2E] italic">{waitingPlan.name}</p>
              <p className="text-xs text-[#64748B] mt-0.5">
                Activates {formatDate(waitingPQ.startDate)}
              </p>
            </div>
          )}
        </div>

        {/* Plan History Accordion */}
        {usedPQs.length > 0 && (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setHistoryOpen((o) => !o)}
              aria-controls="plan-history"
              className="flex items-center gap-2 text-sm font-medium text-[#64748B] hover:text-[#0D1B2E] transition-colors focus-visible:ring-2 focus-visible:ring-[#0F2B5B] focus-visible:outline-none rounded-lg px-2 py-1"
            >
              {historyOpen ? (
                <ChevronUp className="w-4 h-4" aria-hidden="true" />
              ) : (
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
              )}
              View plan history ({usedPQs.length} plans)
            </button>

            {historyOpen && (
              <div
                id="plan-history"
                className="mt-3 bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden"
              >
                {usedPQs.map((pq, i) => {
                  const p = getPlanById(pq.planId);
                  return (
                    <div
                      key={pq.id}
                      className={`flex items-center justify-between px-5 py-3 ${i < usedPQs.length - 1 ? 'border-b border-[#F1F5F9]' : ''
                        }`}
                    >
                      <div>
                        <p className="text-sm font-medium text-[#64748B]">{p?.name ?? 'Unknown'}</p>
                        <p className="text-xs text-[#94A3B8]">
                          {formatDate(pq.startDate)} — {formatDate(pq.endDate)}
                        </p>
                      </div>
                      <PlanStatusBadge status={pq.status} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── Section 2: Available Plans ── */}
      <section aria-labelledby="available-plans-heading">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <h2 id="available-plans-heading" className="font-heading font-semibold text-[#0D1B2E] text-base">
            Available Plans
          </h2>

          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <MapPin className="w-3.5 h-3.5 text-[#00A86B]" aria-hidden="true" />
            <span>Showing prices for: Port Harcourt GRA</span>
            <button className="text-[#0F2B5B] font-medium underline underline-offset-2 hover:text-[#1A3F7A] transition-colors">
              Edit
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 mb-6 p-1 bg-[#F5F7FA] rounded-xl w-fit" aria-label="Plan filters">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={[
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#0F2B5B] focus-visible:outline-none',
                filter === f
                  ? 'bg-white text-[#0D1B2E] shadow-sm'
                  : 'text-[#64748B] hover:text-[#0D1B2E]',
              ].join(' ')}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Plan cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredPlans.map((plan, i) => (
            <div
              key={plan.id}
              className={['animate-fade-up', cardDelayClasses[i % cardDelayClasses.length]].join(' ')}
            >
              <PlanCard
                plan={plan}
                isPopular={plan.id === mostPopularPlanId}
                onBuy={setSelectedPlan}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Buy Plan Modal */}
      {selectedPlan && (
        <BuyPlanModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
      )}

      {/* Toaster */}
      <Link to="/wallet" className="hidden">Top up</Link>
    </div>
  );
}
