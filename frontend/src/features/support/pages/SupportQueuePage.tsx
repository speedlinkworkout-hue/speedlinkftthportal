import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { TicketStatus, TicketCategory } from '@/types/ticket.types';

export function SupportQueuePage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const statusOptions = ['ALL', TicketStatus.OPEN, TicketStatus.IN_PROGRESS, TicketStatus.RESOLVED, TicketStatus.CLOSED];
  const categoryOptions = ['ALL', TicketCategory.BILLING, TicketCategory.TECHNICAL, TicketCategory.ACCOUNT, TicketCategory.OTHER];

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN: return 'bg-blue-100 text-blue-700 border-blue-200';
      case TicketStatus.IN_PROGRESS: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case TicketStatus.RESOLVED: return 'bg-green-100 text-green-700 border-green-200';
      case TicketStatus.CLOSED: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-700 border-red-200';
      case 'MEDIUM': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'LOW': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
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

  // Mock tickets data
  const mockTickets = [
    {
      id: 'TKT-001',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      category: TicketCategory.TECHNICAL,
      subject: 'Internet connection intermittent',
      status: TicketStatus.OPEN,
      priority: 'HIGH',
      assignedTo: null,
      createdAt: '2026-01-15T10:30:00Z',
    },
    {
      id: 'TKT-002',
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      category: TicketCategory.BILLING,
      subject: 'Invoice discrepancy for January',
      status: TicketStatus.IN_PROGRESS,
      priority: 'MEDIUM',
      assignedTo: 'Agent A',
      createdAt: '2026-01-14T14:20:00Z',
    },
    {
      id: 'TKT-003',
      customerName: 'Bob Johnson',
      customerEmail: 'bob@example.com',
      category: TicketCategory.ACCOUNT,
      subject: 'Unable to update profile',
      status: TicketStatus.RESOLVED,
      priority: 'LOW',
      assignedTo: 'Agent B',
      createdAt: '2026-01-13T09:15:00Z',
    },
  ];

  const filteredTickets = mockTickets.filter(ticket => {
    const matchesStatus = statusFilter === 'ALL' || ticket.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || ticket.category === categoryFilter;
    const matchesSearch = searchQuery === '' || 
      ticket.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

  return (
    <div className="p-5 lg:p-8 max-w-screen-xl mx-auto space-y-6">
      <PageHeader
        title="Ticket Queue"
        subtitle="Manage and respond to customer support tickets."
      />

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search by customer name, email, or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E2E8F0] text-sm focus:border-[#0F2B5B] focus:ring-2 focus:ring-[#0F2B5B]/10 outline-none transition-all"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-[#E2E8F0] text-sm focus:border-[#0F2B5B] focus:ring-2 focus:ring-[#0F2B5B]/10 outline-none transition-all"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status.replace('_', ' ')}</option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-[#E2E8F0] text-sm focus:border-[#0F2B5B] focus:ring-2 focus:ring-[#0F2B5B]/10 outline-none transition-all"
          >
            {categoryOptions.map(category => (
              <option key={category} value={category}>{category === 'ALL' ? 'All Categories' : getCategoryLabel(category as TicketCategory)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5F7FA] border-b border-[#E2E8F0]">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">ID</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Customer</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Category</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Subject</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Priority</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Assigned To</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-sm text-[#94A3B8]">
                    No tickets found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-[#F9FAFB] transition-colors cursor-pointer">
                    <td className="px-5 py-4 text-xs font-semibold text-[#64748B]">{ticket.id}</td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-medium text-[#0D1B2E]">{ticket.customerName}</p>
                        <p className="text-xs text-[#94A3B8]">{ticket.customerEmail}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#64748B]">{getCategoryLabel(ticket.category)}</td>
                    <td className="px-5 py-4 text-sm text-[#0D1B2E] max-w-xs truncate">{ticket.subject}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority || 'N/A'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#64748B]">
                      {ticket.assignedTo ? (
                        <span className="px-2 py-1 rounded bg-[#E6F7F1] text-[#00A86B] text-xs font-medium">{ticket.assignedTo}</span>
                      ) : (
                        <button className="text-xs text-[#0F2B5B] font-medium hover:underline">Assign to Me</button>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs text-[#94A3B8]">
                      {new Date(ticket.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
