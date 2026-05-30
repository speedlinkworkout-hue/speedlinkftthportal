export enum TicketCategory {
  BILLING = 'BILLING',
  TECHNICAL = 'TECHNICAL',
  ACCOUNT = 'ACCOUNT',
  OTHER = 'OTHER',
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export interface TicketAttachment {
  id: string;
  name: string;
  type: string;
  sizeBytes: number;
  url?: string;
}

export interface Ticket {
  id: string;
  accountId: string;
  subject: string;
  category: TicketCategory;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  description?: string;
  lastReplyAt?: string;
  lastReplyPreview?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  message: string;
  createdAt: string;
  senderName?: string;
  senderType?: 'CUSTOMER' | 'AGENT' | 'SYSTEM';
  attachments?: TicketAttachment[];
}
