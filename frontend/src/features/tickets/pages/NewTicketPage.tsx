import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm as useRHForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TicketCategory } from '@/types/ticket.types';
import { PageHeader } from '@/components/common/PageHeader';
import { ArrowLeft, Paperclip } from 'lucide-react';
import { Link } from 'react-router-dom';

const ticketSchema = z.object({
  category: z.nativeEnum(TicketCategory, { required_error: 'Please select a category.' }),
  subject: z.string().min(5, 'Subject must be at least 5 characters.').max(100, 'Subject is too long.'),
  description: z.string().min(20, 'Please provide more details (minimum 20 characters).'),
});

type TicketFormValues = z.infer<typeof ticketSchema>;

export function NewTicketPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useRHForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
  });

  const description = watch('description', '');

  const onSubmit = async (data: TicketFormValues) => {
    // Simulate API call
    console.log('Submitting ticket', data);
    await new Promise((resolve) => setTimeout(resolve, 800));
    navigate('/tickets');
  };

  return (
    <div className="p-5 lg:p-8 max-w-screen-md mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/tickets" className="p-2 -ml-2 rounded-xl text-[#64748B] hover:bg-[#F5F7FA] hover:text-[#0D1B2E] transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <PageHeader title="New Ticket" subtitle="We're here to help. Fill out the form below." />
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 lg:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-[#0D1B2E] mb-2">Category</label>
            <select
              {...register('category')}
              className={`w-full px-4 py-3 rounded-xl border ${errors.category ? 'border-[#E63946] focus:ring-[#E63946]/10' : 'border-[#E2E8F0] focus:border-[#0F2B5B] focus:ring-[#0F2B5B]/10'} text-sm focus:ring-2 outline-none transition-all`}
            >
              <option value="">Select a category</option>
              {Object.values(TicketCategory).map((c) => (
                <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>
              ))}
            </select>
            {errors.category && <p className="text-[#E63946] text-xs mt-1.5">{errors.category.message}</p>}
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-semibold text-[#0D1B2E] mb-2">Subject</label>
            <input
              {...register('subject')}
              placeholder="Brief summary of your issue"
              maxLength={100}
              className={`w-full px-4 py-3 rounded-xl border ${errors.subject ? 'border-[#E63946] focus:ring-[#E63946]/10' : 'border-[#E2E8F0] focus:border-[#0F2B5B] focus:ring-[#0F2B5B]/10'} text-sm focus:ring-2 outline-none transition-all`}
            />
            {errors.subject && <p className="text-[#E63946] text-xs mt-1.5">{errors.subject.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-[#0D1B2E] mb-2">Description</label>
            <textarea
              {...register('description')}
              rows={6}
              placeholder="Please provide as much detail as possible..."
              className={`w-full px-4 py-3 rounded-xl border ${errors.description ? 'border-[#E63946] focus:ring-[#E63946]/10' : 'border-[#E2E8F0] focus:border-[#0F2B5B] focus:ring-[#0F2B5B]/10'} text-sm focus:ring-2 outline-none transition-all resize-none`}
            />
            <div className="flex justify-between items-center mt-1.5">
              {errors.description ? (
                <p className="text-[#E63946] text-xs">{errors.description.message}</p>
              ) : <div />}
              <span className="text-[#94A3B8] text-xs">{description.length} / 500</span>
            </div>
          </div>

          {/* Attachment */}
          <div>
            <label className="block text-sm font-semibold text-[#0D1B2E] mb-2">Attachment (Optional)</label>
            <div className="border-2 border-dashed border-[#E2E8F0] rounded-xl p-5 text-center cursor-pointer hover:border-[#0F2B5B]/40 transition-all">
              <Paperclip className="w-5 h-5 text-[#94A3B8] mx-auto mb-2" />
              <p className="text-sm text-[#64748B]">Click to upload or drag and drop</p>
              <p className="text-xs text-[#94A3B8] mt-1">PNG, JPG or PDF (max 5MB)</p>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#0F2B5B] text-white font-semibold hover:bg-[#1A3F7A] transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#0F2B5B] focus-visible:outline-none"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
