import { useState, useRef } from 'react';
import {
  Plus,
  Copy,
  Check,
  
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Paperclip,
  X,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { mockWallet, mockTransactions, mockTransactionLabels } from '@/lib/mock/mockWallet';
import { Transaction } from '@/types/billing.types';



type TxFilter = 'All' | 'Credits' | 'Debits';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
function formatNGN(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`;
}

// ──────────────────────────────────────────────────────────────────────────
// Top Up Modal
// ──────────────────────────────────────────────────────────────────────────
type TopUpTab = 'card' | 'transfer';

const quickAmounts = [2000, 5000, 10000, 20000];
const bankDetails = {
  accountName: 'Speedlink FTTH Ltd',
  bank: 'Guaranty Trust Bank',
  accountNumber: '0123456789',
};

interface TopUpModalProps {
  onClose: () => void;
}

function TopUpModal({ onClose }: TopUpModalProps) {
  const [tab, setTab] = useState<TopUpTab>('card');
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleCopy(value: string, key: string) {
    navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  function handleFileChange(files: FileList | null) {
    if (files?.[0]) setSelectedFile(files[0]);
  }

  function handlePaystack() {
    // Mock Paystack popup
    setTimeout(() => setSuccess(true), 800);
  }

  function handleTransferSubmit() {
    setTimeout(() => {
      setSuccess(true);
    }, 600);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="topup-modal-title"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2E8F0]">
          <h2 id="topup-modal-title" className="font-heading font-semibold text-[#0D1B2E] text-lg">
            {success ? '✅ Payment Received' : 'Top Up Wallet'}
          </h2>
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#0D1B2E] hover:bg-[#F5F7FA] transition-all">
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {success ? (
          <div className="px-6 py-8 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#E6F7F1] flex items-center justify-center">
              <Check className="w-8 h-8 text-[#00A86B]" aria-hidden="true" />
            </div>
            {tab === 'card' ? (
              <>
                <p className="font-heading font-semibold text-[#0D1B2E] text-lg">
                  {formatNGN(Number(amount))} credited!
                </p>
                <p className="text-sm text-[#64748B]">Your wallet has been topped up successfully.</p>
              </>
            ) : (
              <>
                <p className="font-heading font-semibold text-[#0D1B2E] text-lg">Receipt Submitted</p>
                <p className="text-sm text-[#64748B]">
                  Finance team typically approves within 2 hours. You'll receive a notification once confirmed.
                </p>
              </>
            )}
            <button onClick={onClose} className="w-full py-3 rounded-full bg-[#0F2B5B] text-white font-semibold hover:bg-[#1A3F7A] transition-all mt-2">
              Done
            </button>
          </div>
        ) : (
          <div className="px-6 py-5 space-y-5">
            {/* Tab toggle */}
            <div className="flex gap-0 p-1 bg-[#F5F7FA] rounded-xl" aria-label="Top up method">
              {(['card', 'transfer'] as TopUpTab[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={[
                    'flex-1 py-2 rounded-lg text-sm font-medium transition-all',
                    tab === t ? 'bg-white text-[#0D1B2E] shadow-sm' : 'text-[#94A3B8] hover:text-[#64748B]',
                  ].join(' ')}
                >
                  {t === 'card' ? '💳 Pay with Card' : '🏦 Bank Transfer'}
                </button>
              ))}
            </div>

            {tab === 'card' && (
              <div className="space-y-4">
                {/* Quick amounts */}
                <div>
                  <label htmlFor="amount-input" className="text-xs font-semibold text-[#64748B] block mb-2">
                    Amount (NGN)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] font-semibold text-sm" aria-hidden="true">₦</span>
                    <input
                      id="amount-input"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0"
                      className="w-full pl-8 pr-4 py-3 rounded-xl border border-[#E2E8F0] text-[#0D1B2E] font-mono font-semibold text-lg focus:border-[#0F2B5B] focus:ring-2 focus:ring-[#0F2B5B]/10 outline-none transition-all"
                      aria-describedby="quick-amounts"
                    />
                  </div>
                  <div id="quick-amounts" className="flex gap-2 mt-2" aria-label="Quick amount options">
                    {quickAmounts.map((a) => (
                      <button
                        key={a}
                        onClick={() => setAmount(String(a))}
                        className="flex-1 py-1.5 rounded-lg border border-[#E2E8F0] text-xs font-semibold text-[#64748B] hover:border-[#0F2B5B] hover:text-[#0F2B5B] transition-all focus-visible:ring-2 focus-visible:ring-[#0F2B5B] focus-visible:outline-none"
                      >
                        ₦{(a / 1000).toFixed(0)}k
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  id="paystack-proceed-btn"
                  onClick={handlePaystack}
                  disabled={!amount || Number(amount) <= 0}
                  className="w-full py-3 rounded-full bg-[#0F2B5B] text-white font-semibold hover:bg-[#1A3F7A] transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#0F2B5B] focus-visible:outline-none"
                >
                  Proceed to Secure Payment
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-[#94A3B8]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  Secured by Paystack
                </div>
              </div>
            )}

            {tab === 'transfer' && (
              <div className="space-y-4">
                {/* Bank details */}
                <div className="p-4 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0] space-y-3">
                  {[
                    { label: 'Account Name', value: bankDetails.accountName, key: 'name' },
                    { label: 'Bank', value: bankDetails.bank, key: 'bank' },
                    { label: 'Account Number', value: bankDetails.accountNumber, key: 'acc' },
                  ].map(({ label, value, key }) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-[#94A3B8] uppercase font-semibold tracking-wider">{label}</p>
                        <p className={`text-sm font-semibold text-[#0D1B2E] ${key === 'acc' ? 'font-mono' : ''}`}>{value}</p>
                      </div>
                      <button
                        onClick={() => handleCopy(value, key)}
                        aria-label={`Copy ${label}`}
                        className="p-1.5 rounded-lg text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F2B5B] transition-all"
                      >
                        {copied === key ? (
                          <Check className="w-4 h-4 text-[#00A86B]" aria-hidden="true" />
                        ) : (
                          <Copy className="w-4 h-4" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Amount input */}
                <div>
                  <label htmlFor="transfer-amount" className="text-xs font-semibold text-[#64748B] block mb-1.5">
                    Amount Transferred (NGN)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] font-semibold text-sm" aria-hidden="true">₦</span>
                    <input
                      id="transfer-amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0"
                      className="w-full pl-8 pr-4 py-3 rounded-xl border border-[#E2E8F0] text-[#0D1B2E] font-mono font-semibold text-lg focus:border-[#0F2B5B] focus:ring-2 focus:ring-[#0F2B5B]/10 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* File upload */}
                <div>
                  <p className="text-xs font-semibold text-[#64748B] mb-1.5">
                    Upload Payment Receipt
                  </p>
                  <label
                    className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                      isDragging ? 'border-[#0F2B5B] bg-[#F5F7FA]' : 'border-[#E2E8F0] hover:border-[#0F2B5B]/40'
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileChange(e.dataTransfer.files); }}
                    aria-label="Upload payment receipt file"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,application/pdf"
                      onChange={(e) => handleFileChange(e.target.files)}
                      className="hidden"
                      aria-label="Payment receipt file"
                    />
                    {selectedFile ? (
                      <div className="flex items-center justify-center gap-2">
                        <Paperclip className="w-4 h-4 text-[#00A86B]" aria-hidden="true" />
                        <span className="text-sm font-medium text-[#0D1B2E]">{selectedFile.name}</span>
                      </div>
                    ) : (
                      <>
                        <Paperclip className="w-6 h-6 text-[#94A3B8] mx-auto mb-2" aria-hidden="true" />
                        <p className="text-sm text-[#64748B]">Drop file here or tap to upload</p>
                        <p className="text-xs text-[#94A3B8] mt-0.5">JPG, PNG, PDF — max 5MB</p>
                      </>
                    )}
                  </label>
                </div>

                <p className="text-xs text-[#94A3B8] text-center">
                  Finance team typically approves within 2 hours.
                </p>

                <button
                  id="submit-transfer-btn"
                  onClick={handleTransferSubmit}
                  className="w-full py-3 rounded-full bg-[#0F2B5B] text-white font-semibold hover:bg-[#1A3F7A] transition-all focus-visible:ring-2 focus-visible:ring-[#0F2B5B] focus-visible:outline-none"
                >
                  Submit for Review
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Transaction Row
// ──────────────────────────────────────────────────────────────────────────
function TransactionRow({ tx }: { tx: Transaction }) {
  const [expanded, setExpanded] = useState(false);
  const isCredit = tx.type === 'CREDIT';
  const label = mockTransactionLabels[tx.id] ?? 'Transaction';

  return (
    <>
      <div className="flex items-center gap-4 px-5 py-4 hover:bg-[#F9FAFB] transition-colors border-b border-[#F1F5F9] last:border-0">
        <button
          type="button"
          onClick={() => setExpanded((o) => !o)}
          className="flex flex-1 items-center gap-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2B5B] rounded-xl"
        >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isCredit ? 'bg-[#E6F7F1]' : 'bg-[#FFF3F0]'}`} aria-hidden="true">
          {isCredit ? (
            <ArrowDownLeft className="w-5 h-5 text-[#00A86B]" />
          ) : (
            <ArrowUpRight className="w-5 h-5 text-[#E63946]" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[#0D1B2E] truncate">{label}</p>
          <p className="text-xs text-[#94A3B8]">{formatDate(tx.createdAt)}</p>
        </div>

        <div className="text-right shrink-0">
          <p className={`font-mono font-semibold text-sm ${isCredit ? 'text-[#00A86B]' : 'text-[#E63946]'}`}>
            {isCredit ? '+' : '-'}{formatNGN(tx.amountNgn)}
          </p>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${isCredit ? 'bg-[#E6F7F1] text-[#00A86B]' : 'bg-[#FFF3F0] text-[#E63946]'}`}>
            {tx.type}
          </span>
        </div>

        </button>

        <button
          type="button"
          aria-label="Download receipt"
          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#0F2B5B] hover:bg-[#F5F7FA] transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <Download className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {expanded && (
        <div className="px-5 py-4 bg-[#F9FAFB] border-b border-[#F1F5F9] text-xs text-[#64748B] space-y-1.5">
          <div className="flex justify-between">
            <span>Transaction ID</span>
            <span className="font-mono text-[#0D1B2E]">{tx.id.toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span>Method</span>
            <span className="font-medium text-[#0D1B2E]">{tx.method.replace('_', ' ')}</span>
          </div>
          <div className="flex justify-between">
            <span>Status</span>
            <span className="text-[#00A86B] font-semibold">{tx.status}</span>
          </div>
        </div>
      )}
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Wallet Page
// ──────────────────────────────────────────────────────────────────────────
export function WalletPage() {
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [txFilter, setTxFilter] = useState<TxFilter>('All');

  const filteredTxns = mockTransactions.filter((tx) => {
    if (txFilter === 'Credits') return tx.type === 'CREDIT';
    if (txFilter === 'Debits') return tx.type === 'DEBIT';
    return true;
  });

  const txFilters: TxFilter[] = ['All', 'Credits', 'Debits'];

  return (
    <div className="p-5 lg:p-8 max-w-screen-xl mx-auto space-y-6">
      <PageHeader
        title="Wallet & Billing"
        subtitle="Manage your balance, top up, and view transaction history."
        actions={
          <button
            id="download-statement-btn"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#E2E8F0] text-sm font-medium text-[#64748B] hover:border-[#0F2B5B] hover:text-[#0F2B5B] transition-all"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            Download Statement
          </button>
        }
      />

      {/* ── Wallet Hero ── */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 lg:p-8 animate-fade-up">
        <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
          Available Balance
        </p>
        <div
          className="font-mono font-bold text-[#0F2B5B] text-4xl lg:text-5xl mb-1"
          aria-label={`Available balance: ${formatNGN(mockWallet.balanceNgn)}`}
        >
          {formatNGN(mockWallet.balanceNgn)}
        </div>
        <p className="text-sm text-[#94A3B8] mb-6">
          Last credit: ₦10,000 on May 18, 2026
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            id="hero-topup-btn"
            onClick={() => setTopUpOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0F2B5B] text-white font-semibold hover:bg-[#1A3F7A] transition-all focus-visible:ring-2 focus-visible:ring-[#0F2B5B] focus-visible:outline-none"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            Top Up Wallet
          </button>
          <a
            href="/plans"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[#E2E8F0] text-[#0F2B5B] font-semibold hover:border-[#0F2B5B] hover:bg-[#F5F7FA] transition-all focus-visible:ring-2 focus-visible:ring-[#0F2B5B] focus-visible:outline-none"
          >
            Buy a Plan
          </a>
        </div>
      </div>

      {/* ── Transaction History ── */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden animate-fade-up animate-delay-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-[#E2E8F0]">
          <h3 className="font-heading font-semibold text-[#0D1B2E] text-base">
            Transaction History
          </h3>

          {/* Filter tabs */}
          <div className="flex gap-1 p-1 bg-[#F5F7FA] rounded-xl w-fit" aria-label="Transaction filter">
            {txFilters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setTxFilter(f)}
                className={[
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-[#0F2B5B] focus-visible:outline-none',
                  txFilter === f
                    ? 'bg-white text-[#0D1B2E] shadow-sm'
                    : 'text-[#94A3B8] hover:text-[#64748B]',
                ].join(' ')}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div aria-label="Transaction list">
          {filteredTxns.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#94A3B8]">
              No transactions found.
            </div>
          ) : (
            filteredTxns.map((tx) => <TransactionRow key={tx.id} tx={tx} />)
          )}
        </div>
      </div>

      {/* Top Up Modal */}
      {topUpOpen && <TopUpModal onClose={() => setTopUpOpen(false)} />}
    </div>
  );
}
