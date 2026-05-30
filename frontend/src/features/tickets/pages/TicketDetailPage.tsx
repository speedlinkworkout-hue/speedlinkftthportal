import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Send, Paperclip } from 'lucide-react';
import { mockTickets, mockAgents, CUSTOMER_ID } from '@/lib/mock/mockTickets';
import { TicketStatus } from '@/types/ticket.types';
import { useAuthStore } from '@/stores/auth.store';

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function TicketDetailPage() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const ticket = mockTickets.find((t) => t.id === ticketId);
  const { user } = useAuthStore();
  const [replyText, setReplyText] = useState('');

  if (!ticket) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold">Ticket not found</h2>
        <Link to="/tickets" className="text-blue-500 mt-4 inline-block">Back to Tickets</Link>
      </div>
    );
  }

  const isClosed = ticket.status === TicketStatus.RESOLVED || ticket.status === TicketStatus.CLOSED;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-screen-md mx-auto">
      {/* ── Header ── */}
      <div className="bg-white border-b border-[#E2E8F0] px-5 py-4 shrink-0 flex items-center gap-4">
        <Link
          to="/tickets"
          className="p-2 -ml-2 rounded-xl text-[#64748B] hover:bg-[#F5F7FA] hover:text-[#0D1B2E] transition-all"
          aria-label="Back to tickets"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-semibold text-[#64748B]">#{ticket.id}</span>
            <span className="w-1 h-1 rounded-full bg-[#E2E8F0]" />
            <span className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              {ticket.category}
            </span>
          </div>
          <h2 className="font-heading font-semibold text-[#0D1B2E] text-base truncate">
            {ticket.subject}
          </h2>
        </div>
      </div>

      {/* ── Message Thread ── */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#F5F7FA]">
        <div className="text-center">
          <span className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider bg-white px-3 py-1 rounded-full shadow-sm">
            {formatDate(ticket.createdAt)}
          </span>
        </div>

        {ticket.thread.map((msg) => {
          const isCustomer = msg.senderId === CUSTOMER_ID;
          const senderInfo = isCustomer
            ? { name: user?.firstName || 'You', initials: user?.firstName?.[0] || 'Y' }
            : mockAgents[msg.senderId] || { name: 'Support', initials: 'S' };

          return (
            <div key={msg.id} className={`flex gap-3 max-w-[85%] ${isCustomer ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                isCustomer ? 'bg-[#0F2B5B] text-white' : 'bg-white border border-[#E2E8F0] text-[#0F2B5B]'
              }`}>
                {senderInfo.initials}
              </div>
              <div className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}>
                <span className="text-[10px] text-[#94A3B8] mb-1 px-1">
                  {senderInfo.name} · {formatTime(msg.createdAt)}
                </span>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  isCustomer
                    ? 'bg-[#0F2B5B] text-white rounded-tr-sm'
                    : 'bg-white text-[#0D1B2E] border border-[#E2E8F0] rounded-tl-sm'
                }`}>
                  {msg.message}
                </div>
              </div>
            </div>
          );
        })}

        {/* System event if closed */}
        {isClosed && (
          <div className="flex items-center gap-4 py-4">
            <div className="h-px bg-[#E2E8F0] flex-1" />
            <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
              Ticket Closed
            </span>
            <div className="h-px bg-[#E2E8F0] flex-1" />
          </div>
        )}
      </div>

      {/* ── Reply Box ── */}
      <div className="bg-white border-t border-[#E2E8F0] p-4 shrink-0 pb-safe">
        {isClosed ? (
          <div className="text-center p-4 bg-[#F5F7FA] rounded-xl border border-[#E2E8F0]">
            <p className="text-sm text-[#64748B]">This ticket is closed.</p>
            <Link to="/tickets/new" className="text-sm font-semibold text-[#0F2B5B] hover:underline mt-1 inline-block">
              Open a new ticket
            </Link>
          </div>
        ) : (
          <div className="flex items-end gap-3 bg-[#F5F7FA] border border-[#E2E8F0] rounded-2xl p-2 focus-within:border-[#0F2B5B] focus-within:ring-2 focus-within:ring-[#0F2B5B]/10 transition-all">
            <button type="button" aria-label="Attach file" title="Attach file" className="p-2 rounded-xl text-[#94A3B8] hover:text-[#0F2B5B] hover:bg-white transition-all">
              <Paperclip className="w-5 h-5" />
            </button>
            <textarea
              rows={1}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply..."
              className="flex-1 bg-transparent border-none resize-none outline-none py-2.5 text-sm text-[#0D1B2E] placeholder:text-[#94A3B8] min-h-[40px] max-h-[120px]"
            />
            <button
              type="button"
              disabled={!replyText.trim()}
              aria-label="Send reply"
              title="Send reply"
              className="p-2.5 rounded-xl bg-[#00A86B] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-[#009960]"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
