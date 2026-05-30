export enum PaymentMethod {
  PAYSTACK = 'PAYSTACK',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

export interface Wallet {
  id: string;
  accountId: string;
  balanceNgn: number;
  currency: string;
  lastCreditAt?: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  amountNgn: number;
  type: 'CREDIT' | 'DEBIT';
  method: PaymentMethod;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  createdAt: string;
  description?: string;
  reference?: string;
  receiptUrl?: string;
  balanceAfterNgn?: number;
}
