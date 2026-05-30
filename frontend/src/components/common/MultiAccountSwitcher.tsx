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
        className="flex items-center gap-2 pl-3 pr-2 py-2 rounded-xl border border-[#E2E8F0] bg-[#F5F7FA] hover:bg-white hover:border-[#0F2B5B]/20 transition-all duration-200 text-sm focus-visible:ring-2 focus-visible:ring-[#0F2B5B] focus-visible:outline-none"
      >
        <MapPin className="w-3.5 h-3.5 text-[#00A86B] shrink-0" aria-hidden="true" />
        <span className="font-medium text-[#0D1B2E] max-w-[140px] truncate">
          {activeAccount.address}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#64748B] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-[#E2E8F0] shadow-lg overflow-hidden z-50 animate-fade-up"
          aria-label="Select account"
        >
          <div className="px-3 py-2 border-b border-[#E2E8F0]">
            <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
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
                      ? 'bg-[#E6F7F1] text-[#0D1B2E]'
                      : 'text-[#64748B] hover:bg-[#F5F7FA] hover:text-[#0D1B2E]',
                  ].join(' ')}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                      isActive ? 'bg-[#00A86B] text-white' : 'bg-slate-200 text-slate-500'
                    }`}
                    aria-hidden="true"
                  >
                    {account.address[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium truncate ${isActive ? 'text-[#0D1B2E]' : ''}`}>
                      {account.address}
                    </div>
                    <div className="text-xs text-[#94A3B8] font-mono">{account.accountNumber}</div>
                  </div>
                  {isActive && (
                    <Check className="w-3.5 h-3.5 text-[#00A86B] shrink-0" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>
          <div className="border-t border-[#E2E8F0] p-1.5">
            <button
              id="add-account-btn"
              type="button"
              onClick={() => setOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-[#64748B] hover:bg-[#F5F7FA] hover:text-[#0F2B5B] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#0F2B5B] focus-visible:outline-none"
            >
              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0" aria-hidden="true">
                <Plus className="w-3.5 h-3.5 text-[#64748B]" />
              </div>
              <span>Add another connection</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
