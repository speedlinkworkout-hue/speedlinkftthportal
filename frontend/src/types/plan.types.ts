export enum PlanStatus {
  WAITING = 'WAITING',
  ACTIVE = 'ACTIVE',
  USED = 'USED',
  PAUSED = 'PAUSED',
}

export interface Plan {
  id: string;
  name: string;
  description?: string;
  speedMbps: number;
  dataLimitGb: number | null; // null means unlimited
  priceNgn: number;
  durationDays: number; // usually 30
  customerGroup?: 'Home' | 'Business' | 'All';
  isPopular?: boolean;
  features?: string[];
}

export interface PlanQueue {
  id: string;
  accountId: string;
  planId: string;
  status: PlanStatus;
  startDate?: string;
  endDate?: string;
  activatedAt?: string;
  queuedAt?: string;
}
