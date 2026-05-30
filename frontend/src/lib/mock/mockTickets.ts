import { Ticket, TicketMessage, TicketCategory, TicketStatus } from '@/types/ticket.types';

export interface TicketWithThread extends Ticket {
  thread: TicketMessage[];
  lastReply?: string;
  lastReplyPreview?: string;
}


export const mockTickets: TicketWithThread[] = [
  {
    id: 'TKT-0043',
    accountId: 'acc-001',
    subject: 'Cannot connect to internet — all devices affected',
    category: TicketCategory.TECHNICAL,
    status: TicketStatus.OPEN,
    createdAt: '2026-05-26T09:14:00Z',
    updatedAt: '2026-05-26T09:14:00Z',
    description: 'Connection dropped this morning and has not returned.',
    lastReplyAt: '2026-05-26T09:14:00Z',
    thread: [
      {
        id: 'msg-001',
        ticketId: 'TKT-0043',
        senderId: 'usr-001',
        senderName: 'Chukwuemeka Obi',
        senderType: 'CUSTOMER',
        message:
          'Hi, since this morning I have been unable to connect to the internet on any device in my home. The router lights look normal but there is no internet access. Please help.',
        createdAt: '2026-05-26T09:14:00Z',
      },
    ],
    lastReply: '2026-05-26T09:14:00Z',
    lastReplyPreview: 'Hi, since this morning I have been unable to connect...',
  },
  {
    id: 'TKT-0042',
    accountId: 'acc-001',
    subject: 'Internet slow after 8pm every night',
    category: TicketCategory.TECHNICAL,
    status: TicketStatus.IN_PROGRESS,
    createdAt: '2026-05-19T20:45:00Z',
    updatedAt: '2026-05-26T06:30:00Z',
    description: 'Speed slows noticeably every evening after 8pm.',
    lastReplyAt: '2026-05-26T21:05:00Z',
    thread: [
      {
        id: 'msg-002',
        ticketId: 'TKT-0042',
        senderId: 'usr-001',
        senderName: 'Chukwuemeka Obi',
        senderType: 'CUSTOMER',
        message:
          'Every evening after 8pm my internet speed drops drastically. During the day it is fine but at night it becomes very slow. This has been happening for about a week now.',
        createdAt: '2026-05-19T20:45:00Z',
      },
      {
        id: 'msg-003',
        ticketId: 'TKT-0042',
        senderId: 'agent-001',
        senderName: 'Emeka Support',
        senderType: 'AGENT',
        message:
          'Thank you for reaching out. We have escalated this to our network team for investigation. They will be running diagnostics on your line between 10pm–11pm tonight. Please keep your router on.',
        createdAt: '2026-05-20T14:20:00Z',
      },
      {
        id: 'msg-004',
        ticketId: 'TKT-0042',
        senderId: 'usr-001',
        senderName: 'Chukwuemeka Obi',
        senderType: 'CUSTOMER',
        message: 'Still happening tonight. Speed test shows 0.8 Mbps at 9pm. Please escalate further.',
        createdAt: '2026-05-26T21:05:00Z',
      },
    ],
    lastReply: '2026-05-26T21:05:00Z',
    lastReplyPreview: 'Still happening tonight...',
  },
  {
    id: 'TKT-0038',
    accountId: 'acc-001',
    subject: 'Wallet top-up not reflecting',
    category: TicketCategory.BILLING,
    status: TicketStatus.RESOLVED,
    createdAt: '2026-05-10T11:00:00Z',
    updatedAt: '2026-05-11T09:30:00Z',
    description: 'Transferred payment was not reflected in wallet balance.',
    lastReplyAt: '2026-05-11T09:30:00Z',
    thread: [
      {
        id: 'msg-005',
        ticketId: 'TKT-0038',
        senderId: 'usr-001',
        senderName: 'Chukwuemeka Obi',
        senderType: 'CUSTOMER',
        message: 'I made a bank transfer of ₦20,000 two days ago but my wallet balance has not been updated. Transaction reference: BTR-20260508-44231.',
        createdAt: '2026-05-10T11:00:00Z',
      },
      {
        id: 'msg-006',
        ticketId: 'TKT-0038',
        senderId: 'agent-002',
        senderName: 'Ngozi Finance',
        senderType: 'AGENT',
        message:
          'Apologies for the delay. We have confirmed your transfer and manually credited your wallet with ₦20,000. Your updated balance should reflect now. Please let us know if you need anything else.',
        createdAt: '2026-05-11T09:30:00Z',
      },
    ],
    lastReply: '2026-05-11T09:30:00Z',
    lastReplyPreview: 'Apologies for the delay. We have confirmed...',
  },
];

export const mockAgents: Record<string, { name: string; initials: string }> = {
  'agent-001': { name: 'Emeka Support', initials: 'ES' },
  'agent-002': { name: 'Ngozi Finance', initials: 'NF' },
};

export const CUSTOMER_ID = 'usr-001';
