import { apiClient } from '../lib/api/client';
import {
  CreateTicketRequest,
  CreateMessageRequest,
  UpdateTicketStatusRequest,
  TicketListFilters,
} from '../types/ticket.types';

export const ticketService = {
  createTicket: async (data: CreateTicketRequest) => {
    const formData = new FormData();
    formData.append('category', data.category);
    formData.append('subject', data.subject);
    formData.append('description', data.description);
    if (data.attachment) {
      formData.append('attachment', data.attachment);
    }
    const response = await apiClient.post('/tickets', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getTickets: async (filters?: TicketListFilters) => {
    const response = await apiClient.get('/tickets', { params: filters });
    return response.data;
  },

  getTicket: async (id: string) => {
    const response = await apiClient.get(`/tickets/${id}`);
    return response.data;
  },

  getTicketMessages: async (ticketId: string) => {
    const response = await apiClient.get(`/tickets/${ticketId}/messages`);
    return response.data;
  },

  createMessage: async (ticketId: string, data: CreateMessageRequest) => {
    const formData = new FormData();
    formData.append('content', data.content);
    if (data.attachment) {
      formData.append('attachment', data.attachment);
    }
    if (data.isInternal !== undefined) {
      formData.append('isInternal', String(data.isInternal));
    }
    const response = await apiClient.post(`/tickets/${ticketId}/messages`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateTicketStatus: async (ticketId: string, data: UpdateTicketStatusRequest) => {
    const response = await apiClient.patch(`/tickets/${ticketId}/status`, data);
    return response.data;
  },
};
