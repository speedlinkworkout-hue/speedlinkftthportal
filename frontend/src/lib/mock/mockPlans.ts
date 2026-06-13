import { Plan, PlanQueue, PlanStatus } from '@/types/plan.types';

/** Available plan catalogue */
export const mockAvailablePlans: Plan[] = [
  {
    id: 'plan-001',
    name: 'Bonus Plan',
    description: 'Reliable everyday browsing for smaller households.',
    speedMbps: 15,
    dataLimitGb: null,
    priceNgn: 15000,
    durationDays: 14,
    customerGroup: 'Home',
    features: ['Unlimited Data', '5 Mbps Download', '2.5 Mbps Upload'],
  },
  {
    id: 'plan-002',
    name: 'Smart Starter',
    description: 'Balanced speed for families and streaming.',
    speedMbps: 15,
    dataLimitGb: null,
    priceNgn: 20000,
    durationDays: 30,
    customerGroup: 'Home',
    isPopular: true,
    features: ['Unlimited Data', '10 Mbps Download', '5 Mbps Upload'],
  },
  {
    id: 'plan-003',
    name: 'Smart Prenuim',
    description: 'Ideal for work-from-home and heavy streaming.',
    speedMbps: 25,
    dataLimitGb: null,
    priceNgn: 28650,
    durationDays: 30,
    customerGroup: 'Business',
    features: ['Unlimited Data', '25 Mbps Download', '20 Mbps Upload'],
  },
  {
    id: 'plan-004',
    name: 'Smart Diamond',
    description: 'High-capacity connectivity for productive offices.',
    speedMbps: 40,
    dataLimitGb: null,
    priceNgn: 36750,
    durationDays: 30,
    customerGroup: 'Business',
    features: ['Unlimited Data', '40 Mbps Download', '25 Mbps Upload'],
  },
  {
    id: 'plan-004',
    name: 'Smart Gold',
    description: 'High-capacity connectivity for productive offices.',
    speedMbps: 70,
    dataLimitGb: null,
    priceNgn: 52500,
    durationDays: 30,
    customerGroup: 'Business',
    features: ['Unlimited Data', '70 Mbps Download', '50 Mbps Upload'],
  }
];

/** The subscriber's plan queue (active + waiting + used history) */
export const mockPlanQueue: PlanQueue[] = [
  {
    id: 'pq-active',
    accountId: 'acc-001',
    planId: 'plan-002',
    status: PlanStatus.ACTIVE,
    startDate: '2026-05-23T00:00:00Z',
    endDate: '2026-06-22T23:59:59Z',
    activatedAt: '2026-05-23T00:00:00Z',
  },
  {
    id: 'pq-waiting',
    accountId: 'acc-001',
    planId: 'plan-001',
    status: PlanStatus.WAITING,
    startDate: '2026-06-22T00:00:00Z',
    endDate: '2026-07-22T23:59:59Z',
    queuedAt: '2026-05-24T09:10:00Z',
  },
  {
    id: 'pq-used-1',
    accountId: 'acc-001',
    planId: 'plan-002',
    status: PlanStatus.USED,
    startDate: '2026-04-23T00:00:00Z',
    endDate: '2026-05-22T23:59:59Z',
    activatedAt: '2026-04-23T00:00:00Z',
  },
  {
    id: 'pq-used-2',
    accountId: 'acc-001',
    planId: 'plan-001',
    status: PlanStatus.USED,
    startDate: '2026-03-24T00:00:00Z',
    endDate: '2026-04-22T23:59:59Z',
    activatedAt: '2026-03-24T00:00:00Z',
  },
  {
    id: 'pq-used-3',
    accountId: 'acc-001',
    planId: 'plan-003',
    status: PlanStatus.USED,
    startDate: '2026-02-22T00:00:00Z',
    endDate: '2026-03-23T23:59:59Z',
    activatedAt: '2026-02-22T00:00:00Z',
  },
];

export const mostPopularPlanId = 'plan-002';
