import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketService } from '@/services/ticket.service';
import { CreateTicketRequest, CreateMessageRequest, UpdateTicketStatusRequest, TicketListFilters } from '@/types/ticket.types';
import { useAuthStore } from '@/stores/auth.store';

export function useTickets(filters?: TicketListFilters) {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: ['tickets', filters],
    queryFn: () => ticketService.getTickets(filters),
    enabled: !!user, // Only fetch if user is authenticated
  });
}

export function useTicket(id: string) {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: () => ticketService.getTicket(id),
    enabled: !!user && !!id,
  });
}

export function useTicketMessages(ticketId: string) {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: ['ticketMessages', ticketId],
    queryFn: () => ticketService.getTicketMessages(ticketId),
    enabled: !!user && !!ticketId,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateTicketRequest) => ticketService.createTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

export function useCreateMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ticketId, data }: { ticketId: string; data: CreateMessageRequest }) =>
      ticketService.createMessage(ticketId, data),
    onSuccess: (_, { ticketId }) => {
      queryClient.invalidateQueries({ queryKey: ['ticketMessages', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
    },
  });
}

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ticketId, data }: { ticketId: string; data: UpdateTicketStatusRequest }) =>
      ticketService.updateTicketStatus(ticketId, data),
    onSuccess: (_, { ticketId }) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
    },
  });
}
