import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, MapPin, Plus } from 'lucide-react';
import { useAccountStore } from '@/stores/account.store';

export function MultiAccountSwitcher() {
  const { accounts, activeAccountId, setActiveAccount } = useAccountStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const activeAccount = accounts.find((a) => a.id === activeAccountId);

  // Close on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  if (!activeAccount) return null;

  return (
    <div ref={ref} className="relative">
      <button
        id="account-switcher"
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Active account: ${activeAccount.address}`}
        className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-[#F5F7FA] py-2 pl-3 pr-2 text-sm transition-all duration-200 hover:border-[#0F2B5B]/20 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2B5B] dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600 dark:hover:bg-gray-700"
      >
        <MapPin className="w-3.5 h-3.5 text-[#00A86B] shrink-0" aria-hidden="true" />
        <span className="max-w-[140px] truncate font-medium text-[#0D1B2E] dark:text-gray-100">
          {activeAccount.address}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-[#64748B] transition-transform duration-200 dark:text-gray-400 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-64 animate-fade-up overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900"
          aria-label="Select account"
        >
          <div className="border-b border-[#E2E8F0] px-3 py-2 dark:border-gray-800">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] dark:text-gray-500">
              Your Connections
            </p>
          </div>
          <div className="p-1.5 space-y-0.5">
            {accounts.map((account) => {
              const isActive = account.id === activeAccountId;
              return (
                <button
                  key={account.id}
                  type="button"
                  onClick={() => {
                    setActiveAccount(account.id);
                    setOpen(false);
                  }}
                  className={[
                    'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#0F2B5B] focus-visible:outline-none',
                    isActive
                      ? 'bg-[#E6F7F1] text-[#0D1B2E] dark:bg-emerald-500/15 dark:text-gray-100'
                      : 'text-[#64748B] hover:bg-[#F5F7FA] hover:text-[#0D1B2E] dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100',
                  ].join(' ')}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                      isActive ? 'bg-[#00A86B] text-white' : 'bg-slate-200 text-slate-500 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                    aria-hidden="true"
                  >
                    {account.address[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`truncate font-medium ${isActive ? 'text-[#0D1B2E] dark:text-gray-100' : ''}`}>
                      {account.address}
                    </div>
                    <div className="font-mono text-xs text-[#94A3B8] dark:text-gray-500">{account.accountNumber}</div>
                  </div>
                  {isActive && (
                    <Check className="w-3.5 h-3.5 text-[#00A86B] shrink-0" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>
          <div className="border-t border-[#E2E8F0] p-1.5 dark:border-gray-800">
            <button
              id="add-account-btn"
              type="button"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-[#64748B] transition-all duration-200 hover:bg-[#F5F7FA] hover:text-[#0F2B5B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2B5B] dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-gray-800" aria-hidden="true">
                <Plus className="h-3.5 w-3.5 text-[#64748B] dark:text-gray-400" />
              </div>
              <span>Add another connection</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
