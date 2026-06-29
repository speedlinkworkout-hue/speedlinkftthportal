import { Wallet, Transaction, PaymentMethod } from '@/types/billing.types';


export const mockWallets: Record<string, Wallet> = {
  'acc-001': {
    id: 'wal-001',
    accountId: 'acc-001',
    balanceNgn: 500000,
    currency: 'NGN',
    lastCreditAt: '2026-05-18T14:15:00Z',
  },
  'acc-002': {
    id: 'wal-002',
    accountId: 'acc-002',
    balanceNgn: 150000,
    currency: 'NGN',
    lastCreditAt: '2026-06-01T10:00:00Z',
  }
};


export const mockTransactionsRecord: Record<string, Transaction[]> = {
  'acc-001': [
    {
      id: 'txn-001',
      walletId: 'wal-001',
      amountNgn: 15000,
      type: 'DEBIT',
      method: PaymentMethod.PAYSTACK,
      status: 'SUCCESS',
      createdAt: '2026-05-20T10:30:00Z',
      description: 'Plan Purchase — 10 Mbps Unlimited',
      reference: 'SLP-52030-1001',
      balanceAfterNgn: 8500,
    },
    {
      id: 'txn-002',
      walletId: 'wal-001',
      amountNgn: 20000,
      type: 'CREDIT',
      method: PaymentMethod.PAYSTACK,
      status: 'SUCCESS',
      createdAt: '2026-05-18T14:15:00Z',
      description: 'Wallet Top Up — Paystack',
      reference: 'PSK-51815-2002',
      balanceAfterNgn: 23500,
    },
    {
      id: 'txn-003',
      walletId: 'wal-001',
      amountNgn: 8000,
      type: 'DEBIT',
      method: PaymentMethod.PAYSTACK,
      status: 'SUCCESS',
      createdAt: '2026-04-22T09:00:00Z',
      description: 'Plan Purchase — 5 Mbps Home',
      reference: 'SLP-42209-1003',
      balanceAfterNgn: 5000,
    },
    {
      id: 'txn-004',
      walletId: 'wal-001',
      amountNgn: 10000,
      type: 'CREDIT',
      method: PaymentMethod.BANK_TRANSFER,
      status: 'SUCCESS',
      createdAt: '2026-04-20T16:45:00Z',
      description: 'Wallet Top Up — Bank Transfer',
      reference: 'BTR-42016-4004',
      balanceAfterNgn: 13000,
    },
    {
      id: 'txn-005',
      walletId: 'wal-001',
      amountNgn: 15000,
      type: 'DEBIT',
      method: PaymentMethod.PAYSTACK,
      status: 'SUCCESS',
      createdAt: '2026-03-23T08:20:00Z',
      description: 'Plan Purchase — 10 Mbps Unlimited',
      reference: 'SLP-32308-1005',
      balanceAfterNgn: 0,
    },
    {
      id: 'txn-006',
      walletId: 'wal-001',
      amountNgn: 25000,
      type: 'CREDIT',
      method: PaymentMethod.BANK_TRANSFER,
      status: 'SUCCESS',
      createdAt: '2026-03-20T11:30:00Z',
      description: 'Wallet Top Up — Bank Transfer',
      reference: 'BTR-32011-4006',
      balanceAfterNgn: 25000,
    },
    {
      id: 'txn-007',
      walletId: 'wal-001',
      amountNgn: 22000,
      type: 'DEBIT',
      method: PaymentMethod.PAYSTACK,
      status: 'SUCCESS',
      createdAt: '2026-02-22T07:45:00Z',
      description: 'Plan Purchase — 20 Mbps Plus',
      reference: 'SLP-22207-1007',
      balanceAfterNgn: 3000,
    },
    {
      id: 'txn-008',
      walletId: 'wal-001',
      amountNgn: 30000,
      type: 'CREDIT',
      method: PaymentMethod.PAYSTACK,
      status: 'SUCCESS',
      createdAt: '2026-02-18T13:00:00Z',
      description: 'Wallet Top Up — Paystack',
      reference: 'PSK-21813-2008',
      balanceAfterNgn: 25000,
    },
  ],
  'acc-002': [
    {
      id: 'txn-009',
      walletId: 'wal-002',
      amountNgn: 50000,
      type: 'CREDIT',
      method: PaymentMethod.BANK_TRANSFER,
      status: 'SUCCESS',
      createdAt: '2026-06-01T10:00:00Z',
      description: 'Wallet Top Up — Bank Transfer',
      reference: 'BTR-60110-5009',
      balanceAfterNgn: 150000,
    }
  ]
};

export const mockTransactionLabelsRecord: Record<string, Record<string, string>> = {
  'acc-001': {
    'txn-001': 'Plan Purchase — 10 Mbps Unlimited',
    'txn-002': 'Wallet Top Up — Paystack',
    'txn-003': 'Plan Purchase — 5 Mbps Home',
    'txn-004': 'Wallet Top Up — Bank Transfer',
    'txn-005': 'Plan Purchase — 10 Mbps Unlimited',
    'txn-006': 'Wallet Top Up — Bank Transfer',
    'txn-007': 'Plan Purchase — 20 Mbps Plus',
    'txn-008': 'Wallet Top Up — Paystack',
  },
  'acc-002': {
    'txn-009': 'Wallet Top Up — Bank Transfer',
  }
};
