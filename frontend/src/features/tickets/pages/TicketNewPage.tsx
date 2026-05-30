import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Paperclip, Upload } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { mockAccounts } from '@/lib/mock/mockAccounts';
import { TicketCategory } from '@/types/ticket.types';
import { useToast } from '@/hooks/use-toast';

const ticketSchema = z.object({
  category: z.nativeEnum(TicketCategory),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(100, 'Subject must be at most 100 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  attachment: z
    .any()
    .optional()
    .refine((files) => !files || files.length === 0 || files[0]?.size <= 5 * 1024 * 1024, 'Attachment must be 5MB or smaller'),
});

type TicketFormValues = z.infer<typeof ticketSchema>;

const categoryLabels: Record<TicketCategory, string> = {
  [TicketCategory.BILLING]: 'Billing',
  [TicketCategory.TECHNICAL]: 'Technical',
  [TicketCategory.ACCOUNT]: 'Account',
  [TicketCategory.OTHER]: 'Other',
};

export function TicketNewPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const defaultCategory = useMemo(() => {
    const category = searchParams.get('category');
    if (category && Object.values(TicketCategory).includes(category as TicketCategory)) {
      return category as TicketCategory;
    }
    return TicketCategory.TECHNICAL;
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      category: defaultCategory,
      subject: '',
      description: '',
    },
  });

  const description = watch('description') ?? '';

  async function onSubmit(values: TicketFormValues) {
    const ticketId = `TKT-${Math.floor(Math.random() * 9000 + 1000)}`;
    const now = new Date().toISOString();

    sessionStorage.setItem(
      `speedlink-ticket-${ticketId}`,
      JSON.stringify({
        id: ticketId,
        accountId: mockAccounts[0]?.id ?? 'acc-001',
        subject: values.subject,
        category: values.category,
        status: 'OPEN',
        createdAt: now,
        updatedAt: now,
        description: values.description,
        lastReplyAt: now,
        lastReplyPreview: values.description.slice(0, 70),
        thread: [
          {
            id: `${ticketId}-msg-1`,
            ticketId,
            senderId: 'usr-001',
            senderName: 'Chukwuemeka Obi',
            senderType: 'CUSTOMER',
            message: values.description,
            createdAt: now,
          },
        ],
      }),
    );

    toast({
      title: `Ticket ${ticketId} submitted`,
      description: 'Our support team will review it shortly.',
      variant: 'success',
    });

    navigate(`/tickets/${ticketId}`);
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-6 lg:px-8 lg:py-8">
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => navigate('/tickets')}
          aria-label="Back to tickets"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all duration-200 hover:border-slate-300 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <PageHeader
          title="New Ticket"
          subtitle="Tell us what is happening and attach any helpful evidence if needed."
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
        <div className="grid gap-5">
          <div>
            <label htmlFor="category" className="mb-2 block text-sm font-medium text-slate-700">
              Category
            </label>
            <select
              id="category"
              {...register('category')}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
            >
              {Object.values(TicketCategory).map((category) => (
                <option key={category} value={category}>
                  {categoryLabels[category]}
                </option>
              ))}
            </select>
            {errors.category && <p className="mt-2 text-sm text-rose-600">{errors.category.message}</p>}
          </div>

          <div>
            <label htmlFor="subject" className="mb-2 block text-sm font-medium text-slate-700">
              Subject
            </label>
            <input
              id="subject"
              maxLength={100}
              placeholder="Short summary of the issue"
              {...register('subject')}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
            {errors.subject && <p className="mt-2 text-sm text-rose-600">{errors.subject.message}</p>}
          </div>

          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              id="description"
              rows={8}
              minLength={50}
              placeholder="Explain the issue in as much detail as possible"
              {...register('description')}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
              {errors.description ? (
                <p className="text-sm text-rose-600">{errors.description.message}</p>
              ) : (
                <p>Minimum 50 characters required.</p>
              )}
              <span>{description.length} chars</span>
            </div>
          </div>

          <Controller
            control={control}
            name="attachment"
            render={({ field }) => (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Attachment</label>
                <input
                  id="ticket-attachment"
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  className="sr-only"
                  onChange={(event) => field.onChange(event.target.files)}
                  aria-label="Upload ticket attachment"
                />
                <label
                  htmlFor="ticket-attachment"
                  onDrop={(event) => {
                    event.preventDefault();
                    field.onChange(event.dataTransfer.files);
                  }}
                  onDragOver={(event) => event.preventDefault()}
                  className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-center transition-all duration-200 hover:border-primary/40 hover:bg-white"
                >
                  <Upload className="h-6 w-6 text-slate-400" aria-hidden="true" />
                  <p className="mt-3 text-sm font-medium text-slate-700">Drag and drop a receipt or screenshot</p>
                  <p className="mt-1 text-xs text-slate-400">JPG, PNG, or PDF up to 5MB</p>
                  {field.value?.[0] && (
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm">
                      <Paperclip className="h-3.5 w-3.5" aria-hidden="true" />
                      {field.value[0].name}
                    </div>
                  )}
                </label>
                {errors.attachment && <p className="mt-2 text-sm text-rose-600">{errors.attachment.message as string}</p>}
              </div>
            )}
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={() => navigate('/tickets')}
              className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition-all duration-200 hover:border-slate-300 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Upload className="h-4 w-4" aria-hidden="true" />
              Submit Ticket
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
