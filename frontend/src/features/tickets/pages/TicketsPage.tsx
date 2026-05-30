import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, MailOpen, Clock, AlertCircle } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { mockTickets } from '@/lib/mock/mockTickets';
import { TicketCategory, TicketStatus } from '@/types/ticket.types';
import { useToast } from '@/hooks/use-toast';

// TODO: replace with useQuery hook

type StatusFilter = 'All' | 'Open' | 'In Progress' | 'Resolved';
type CategoryFilter = 'All' | TicketCategory;

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const statusConfig: Record<TicketStatus, { label: string; color: string; bgColor: string }> = {
  [TicketStatus.OPEN]: { label: 'Open', color: 'text-amber-600', bgColor: 'bg-amber-50 border-amber-200' },
  [TicketStatus.IN_PROGRESS]: { label: 'In Progress', color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-200' },
  [TicketStatus.RESOLVED]: { label: 'Resolved', color: 'text-[#00A86B]', bgColor: 'bg-[#E6F7F1] border-[#00A86B]/30' },
  [TicketStatus.CLOSED]: { label: 'Closed', color: 'text-slate-500', bgColor: 'bg-slate-100 border-slate-200' },
};

function TicketStatusBadge({ status }: { status: TicketStatus }) {
  const config = statusConfig[status];
  const isBlue = status === TicketStatus.IN_PROGRESS;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${config.bgColor} ${config.color}`}>
      {status === TicketStatus.OPEN && <AlertCircle className="w-3 h-3" />}
      {status === TicketStatus.IN_PROGRESS && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>
      )}
      {config.label}
    </span>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Tickets Page
// ──────────────────────────────────────────────────────────────────────────
export function TicketsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All');
  const navigate = useNavigate();

  const filteredTickets = mockTickets.filter((ticket) => {
    const sMatch =
      statusFilter === 'All' ||
      (statusFilter === 'Open' && ticket.status === TicketStatus.OPEN) ||
      (statusFilter === 'In Progress' && ticket.status === TicketStatus.IN_PROGRESS) ||
      (statusFilter === 'Resolved' && (ticket.status === TicketStatus.RESOLVED || ticket.status === TicketStatus.CLOSED));

    const cMatch = categoryFilter === 'All' || ticket.category === categoryFilter;

    return sMatch && cMatch;
  });

  return (
    <div className="p-5 lg:p-8 max-w-screen-xl mx-auto space-y-6">
      <PageHeader
        title="Support Tickets"
        subtitle="View and manage your support requests."
        actions={
          <Link
            to="/tickets/new"
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#0F2B5B] text-white text-sm font-semibold hover:bg-[#1A3F7A] transition-all focus-visible:ring-2 focus-visible:ring-[#0F2B5B] focus-visible:outline-none"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            New Ticket
          </Link>
        }
      />

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex gap-1 p-1 bg-[#F5F7FA] rounded-xl w-fit" role="tablist">
          {(['All', 'Open', 'In Progress', 'Resolved'] as StatusFilter[]).map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={statusFilter === f}
              onClick={() => setStatusFilter(f)}
              className={[
                'px-4 py-2 rounded-lg text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-[#0F2B5B] focus-visible:outline-none',
                statusFilter === f
                  ? 'bg-white text-[#0D1B2E] shadow-sm'
                  : 'text-[#64748B] hover:text-[#0D1B2E]',
              ].join(' ')}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Category Dropdown */}
        <div className="relative w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
            className="w-full sm:w-48 appearance-none pl-4 pr-10 py-2 rounded-xl border border-[#E2E8F0] bg-white text-sm font-medium text-[#0D1B2E] focus:border-[#0F2B5B] focus:ring-2 focus:ring-[#0F2B5B]/10 outline-none transition-all"
            aria-label="Filter by category"
          >
            <option value="All">All Categories</option>
            {Object.values(TicketCategory).map((c) => (
              <option key={c} value={c}>
                {c.charAt(0) + c.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#64748B]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Ticket List ── */}
      {filteredTickets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm animate-fade-up">
          <EmptyState
            icon={MailOpen}
            title="No tickets found"
            description="You don't have any support tickets matching these filters."
            cta={{ label: 'Open a Ticket', href: '/tickets/new' }}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTickets.map((ticket, i) => (
            <div
              key={ticket.id}
              onClick={() => navigate(`/tickets/${ticket.id}`)}
              className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5 hover:border-[#0F2B5B]/30 hover:shadow-md transition-all cursor-pointer animate-fade-up"
              style={{ animationDelay: `${i * 50}ms` }}
              role="article"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/tickets/${ticket.id}`)}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-sm font-semibold text-[#0F2B5B]">#{ticket.id}</span>
                    <span className="w-1 h-1 rounded-full bg-[#E2E8F0]" aria-hidden="true" />
                    <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider bg-[#F5F7FA] px-2 py-0.5 rounded-md">
                      {ticket.category.toLowerCase()}
                    </span>
                  </div>
                  <h3 className="font-heading font-semibold text-[#0D1B2E] text-base sm:text-lg truncate">
                    {ticket.subject}
                  </h3>
                </div>
                <div className="shrink-0">
                  <TicketStatusBadge status={ticket.status} />
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-[#64748B] mb-4">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  Opened {formatDate(ticket.createdAt)}
                </div>
                <div className="flex items-center gap-1.5">
                  <MailOpen className="w-3.5 h-3.5" aria-hidden="true" />
                  Last reply: {formatDate(ticket.updatedAt)}
                </div>
              </div>

              {ticket.lastReplyPreview && (
                <div className="pt-4 border-t border-[#F1F5F9] flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#F5F7FA] flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-[#64748B]">You</span>
                  </div>
                  <p className="text-sm text-[#64748B] truncate flex-1 leading-6">
                    "{ticket.lastReplyPreview}"
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
