import { Link } from 'react-router-dom';
import { TrendingUp, Plus } from 'lucide-react';

interface WalletBalanceWidgetProps {
  balance: number;
  variant: 'compact' | 'full';
}

function formatNGN(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`;
}

export function WalletBalanceWidget({ balance, variant }: WalletBalanceWidgetProps) {
  if (variant === 'compact') {
    return (
      <div className="px-3 py-3 rounded-xl bg-white/10 border border-white/10">
        <div className="flex items-center justify-between mb-1">
          <span className="text-white/60 text-[10px] font-medium uppercase tracking-wider">
            Wallet
          </span>
          <TrendingUp className="w-3 h-3 text-[#00A86B]" aria-hidden="true" />
        </div>
        <div
          className="font-mono font-semibold text-white text-base leading-tight"
          aria-label={`Wallet balance: ${formatNGN(balance)}`}
        >
          {formatNGN(balance)}
        </div>
        <Link
          to="/wallet"
          className="mt-2 flex items-center gap-1 text-[10px] text-white/50 hover:text-white transition-colors"
          aria-label="Top up wallet"
        >
          <Plus className="w-2.5 h-2.5" aria-hidden="true" />
          Top Up
        </Link>
      </div>
    );
  }

  // Full variant (dashboard card)
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
          Wallet Balance
        </span>
        <div className="w-8 h-8 rounded-lg bg-[#E6F7F1] flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-[#00A86B]" aria-hidden="true" />
        </div>
      </div>

      <div>
        <div
          className="font-mono text-3xl font-bold leading-tight text-[#0F2B5B] dark:text-gray-100"
          aria-label={`Wallet balance: ${formatNGN(balance)}`}
        >
          {formatNGN(balance)}
        </div>
        <p className="mt-1 text-xs text-[#94A3B8] dark:text-gray-500">
          Last credit: ₦5,000 on May 20, 2026
        </p>
      </div>

      <div className="flex gap-2">
        <Link
          to="/wallet"
          id="wallet-topup-btn"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-[#0F2B5B] text-white text-sm font-semibold hover:bg-[#1A3F7A] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#0F2B5B] focus-visible:outline-none"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          Top Up
        </Link>
        <Link
          to="/wallet"
          id="wallet-history-link"
          className="flex flex-1 items-center justify-center rounded-full border border-[#E2E8F0] py-2.5 text-sm font-medium text-[#64748B] transition-all duration-200 hover:border-[#0F2B5B]/30 hover:text-[#0F2B5B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2B5B] dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-white"
        >
          View History
        </Link>
      </div>
    </div>
  );
}
