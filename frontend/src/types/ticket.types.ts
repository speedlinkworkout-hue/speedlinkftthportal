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

export interface Ticket {
  id: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  category: TicketCategory;
  subject: string;
  description: string;
  status: TicketStatus;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  assignedTo?: string; // Support agent ID
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  attachmentUrl?: string;
  attachmentName?: string;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderRole: 'CUSTOMER' | 'SUPPORT' | 'ADMIN';
  content: string;
  attachmentUrl?: string;
  attachmentName?: string;
  createdAt: string;
  isInternal?: boolean; // For agent-only notes
}

export interface CreateTicketRequest {
  category: TicketCategory;
  subject: string;
  description: string;
  attachment?: File;
}

export interface CreateTicketResponse {
  ticket: Ticket;
}

export interface UpdateTicketStatusRequest {
  status: TicketStatus;
  assignedTo?: string;
}

export interface CreateMessageRequest {
  content: string;
  attachment?: File;
  isInternal?: boolean;
}

export interface TicketListFilters {
  status?: TicketStatus;
  category?: TicketCategory;
  customerId?: string;
  assignedTo?: string;
  dateFrom?: string;
  dateTo?: string;
}
