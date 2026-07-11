import { useState } from 'react';
import { Plus, MessageSquare } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { TicketStatus, TicketCategory } from '@/types/ticket.types';
import { CreateTicketModal } from '@/components/support/CreateTicketModal';

type StatusFilter = 'ALL' | TicketStatus;

export function CustomerTicketsPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');

  const statusFilters: StatusFilter[] = ['ALL', TicketStatus.OPEN, TicketStatus.IN_PROGRESS, TicketStatus.RESOLVED, TicketStatus.CLOSED];

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN: return 'bg-blue-100 text-blue-700 border-blue-200';
      case TicketStatus.IN_PROGRESS: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case TicketStatus.RESOLVED: return 'bg-green-100 text-green-700 border-green-200';
      case TicketStatus.CLOSED: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryLabel = (category: TicketCategory) => {
    switch (category) {
      case TicketCategory.BILLING: return 'Billing';
      case TicketCategory.TECHNICAL: return 'Technical';
      case TicketCategory.ACCOUNT: return 'Account';
      case TicketCategory.OTHER: return 'Other';
    }
  };

  // Mock data - will be replaced with API calls
  const mockTickets = [
    {
      id: 'TKT-001',
      category: TicketCategory.TECHNICAL,
      subject: 'Internet connection intermittent',
      status: TicketStatus.OPEN,
      createdAt: '2026-01-15T10:30:00Z',
    },
    {
      id: 'TKT-002',
      category: TicketCategory.BILLING,
      subject: 'Invoice discrepancy for January',
      status: TicketStatus.IN_PROGRESS,
      createdAt: '2026-01-14T14:20:00Z',
    },
  ];

  const filteredTickets = mockTickets.filter(ticket => 
    statusFilter === 'ALL' || ticket.status === statusFilter
  );

  return (
    <div className="p-5 lg:p-8 max-w-screen-xl mx-auto space-y-6">
      <PageHeader
        title="My Tickets"
        subtitle="View and manage your support tickets."
        actions={
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0F2B5B] text-white font-medium hover:bg-[#1A3F7A] transition-all"
          >
            <Plus className="w-4 h-4" />
            Create New Ticket
          </button>
        }
      />

      {/* Status Filter Tabs */}
      <div className="flex gap-1 p-1 bg-[#F5F7FA] rounded-xl w-fit mx-auto" aria-label="Status filter">
        {statusFilters.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-[#0F2B5B] focus-visible:outline-none',
              statusFilter === status
                ? 'bg-white text-[#0D1B2E] shadow-sm'
                : 'text-[#94A3B8] hover:text-[#64748B]',
            ].join(' ')}
          >
            {status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        {filteredTickets.length === 0 ? (
          <div className="py-12 text-center">
            <MessageSquare className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
            <p className="text-sm text-[#94A3B8]">No tickets found.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#F1F5F9]">
            {filteredTickets.map((ticket) => (
              <button
                key={ticket.id}
                className="w-full px-5 py-4 hover:bg-[#F9FAFB] transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2B5B] focus-visible:ring-inset"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-[#64748B]">{ticket.id}</span>
                      <span className="text-xs text-[#94A3B8]">•</span>
                      <span className="text-xs text-[#94A3B8]">{getCategoryLabel(ticket.category)}</span>
                    </div>
                    <p className="text-sm font-medium text-[#0D1B2E] mb-2">{ticket.subject}</p>
                    <p className="text-xs text-[#94A3B8]">
                      {new Date(ticket.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(ticket.status)}`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {createModalOpen && <CreateTicketModal onClose={() => setCreateModalOpen(false)} />}
    </div>
  );
}
