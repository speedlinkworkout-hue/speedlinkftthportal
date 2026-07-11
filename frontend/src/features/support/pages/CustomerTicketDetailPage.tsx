import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Paperclip, Send } from 'lucide-react';
import { TicketStatus, TicketCategory } from '@/types/ticket.types';

export function CustomerTicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [replyText, setReplyText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  // Mock ticket data
  const mockTicket = {
    id: id || 'TKT-001',
    category: TicketCategory.TECHNICAL,
    subject: 'Internet connection intermittent',
    description: 'My internet connection has been dropping frequently over the past few days. It happens mostly in the evening between 6 PM and 9 PM.',
    status: TicketStatus.OPEN,
    createdAt: '2026-01-15T10:30:00Z',
    updatedAt: '2026-01-15T10:30:00Z',
  };

  // Mock messages
  const mockMessages = [
    {
      id: 'MSG-001',
      senderName: 'John Doe',
      senderRole: 'CUSTOMER' as const,
      content: 'My internet connection has been dropping frequently over the past few days. It happens mostly in the evening between 6 PM and 9 PM.',
      createdAt: '2026-01-15T10:30:00Z',
    },
  ];

  const isClosed = mockTicket.status === TicketStatus.CLOSED;

  function handleReply() {
    if (!replyText.trim()) return;
    // TODO: Implement actual reply submission
    setReplyText('');
    setSelectedFile(null);
  }

  return (
    <div className="p-5 lg:p-8 max-w-screen-xl mx-auto space-y-6">
      {/* Back Button */}
      <Link
        to="/support/tickets"
        className="flex items-center gap-2 text-sm text-[#64748B] hover:text-[#0F2B5B] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to My Tickets
      </Link>

      {/* Ticket Header */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-[#64748B]">{mockTicket.id}</span>
              <span className="text-xs text-[#94A3B8]">•</span>
              <span className="text-xs text-[#94A3B8]">{getCategoryLabel(mockTicket.category)}</span>
            </div>
            <h1 className="text-xl font-semibold text-[#0D1B2E] mb-2">{mockTicket.subject}</h1>
            <p className="text-sm text-[#64748B]">{mockTicket.description}</p>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(mockTicket.status)}`}>
            {mockTicket.status.replace('_', ' ')}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-[#94A3B8] pt-4 border-t border-[#F1F5F9]">
          <span>Created: {new Date(mockTicket.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          <span>Updated: {new Date(mockTicket.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Message Thread */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E2E8F0]">
          <h2 className="font-semibold text-[#0D1B2E]">Conversation</h2>
        </div>
        <div className="p-6 space-y-4">
          {mockMessages.map((message) => (
            <div key={message.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0F2B5B] flex items-center justify-center text-white text-xs font-semibold shrink-0">
                {message.senderName.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-[#0D1B2E]">{message.senderName}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    message.senderRole === 'CUSTOMER' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {message.senderRole}
                  </span>
                  <span className="text-xs text-[#94A3B8]">
                    {new Date(message.createdAt).toLocaleString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-sm text-[#64748B]">{message.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Reply Form */}
        {!isClosed && (
          <div className="p-6 border-t border-[#E2E8F0]">
            <div className="space-y-3">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-[#0D1B2E] focus:border-[#0F2B5B] focus:ring-2 focus:ring-[#0F2B5B]/10 outline-none transition-all resize-none"
                disabled={isClosed}
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-[#64748B] cursor-pointer hover:text-[#0F2B5B] transition-colors">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <Paperclip className="w-4 h-4" />
                  {selectedFile ? selectedFile.name : 'Attach file'}
                </label>
                <button
                  onClick={handleReply}
                  disabled={!replyText.trim()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0F2B5B] text-white font-medium hover:bg-[#1A3F7A] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        )}

        {isClosed && (
          <div className="p-6 border-t border-[#E2E8F0] text-center text-sm text-[#94A3B8]">
            This ticket is closed. No further replies can be added.
          </div>
        )}
      </div>
    </div>
  );
}
