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

/** The subscriber's plan queue (active + waiting + used history) mapped by accountId */
export const mockPlanQueues: Record<string, PlanQueue[]> = {
  'acc-001': [
    {
      id: 'pq-active-1',
      accountId: 'acc-001',
      planId: 'plan-003', // Smart Prenuim
      status: PlanStatus.ACTIVE,
      startDate: '2026-06-20T00:00:00Z',
      endDate: '2026-07-20T23:59:59Z',
      activatedAt: '2026-06-20T00:00:00Z',
    },
    {
      id: 'pq-waiting-1',
      accountId: 'acc-001',
      planId: 'plan-001',
      status: PlanStatus.WAITING,
      startDate: '2026-07-21T00:00:00Z',
      endDate: '2026-08-20T23:59:59Z',
      queuedAt: '2026-06-22T09:10:00Z',
    },
    {
      id: 'pq-used-1',
      accountId: 'acc-001',
      planId: 'plan-002',
      status: PlanStatus.USED,
      startDate: '2026-05-21T00:00:00Z',
      endDate: '2026-06-19T23:59:59Z',
      activatedAt: '2026-05-21T00:00:00Z',
    },
    {
      id: 'pq-used-2',
      accountId: 'acc-001',
      planId: 'plan-001',
      status: PlanStatus.USED,
      startDate: '2026-04-21T00:00:00Z',
      endDate: '2026-05-20T23:59:59Z',
      activatedAt: '2026-04-21T00:00:00Z',
    },
  ],
  'acc-002': [
    {
      id: 'pq-waiting-2',
      accountId: 'acc-002',
      planId: 'plan-002',
      status: PlanStatus.WAITING,
      startDate: '2026-06-25T00:00:00Z',
      endDate: '2026-07-25T23:59:59Z',
      queuedAt: '2026-06-20T10:15:00Z',
    },
    {
      id: 'pq-used-3',
      accountId: 'acc-002',
      planId: 'plan-004',
      status: PlanStatus.USED,
      startDate: '2026-05-22T00:00:00Z',
      endDate: '2026-06-21T23:59:59Z',
      activatedAt: '2026-05-22T00:00:00Z',
    },
  ]
};

export const mostPopularPlanId = 'plan-002';
