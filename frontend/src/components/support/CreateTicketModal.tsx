import { useState, useRef } from 'react';
import { X, Paperclip, Check } from 'lucide-react';
import { TicketCategory, CreateTicketRequest } from '@/types/ticket.types';

interface CreateTicketModalProps {
  onClose: () => void;
}

export function CreateTicketModal({ onClose }: CreateTicketModalProps) {
  const [category, setCategory] = useState<TicketCategory>(TicketCategory.OTHER);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(files: FileList | null) {
    if (files?.[0]) setSelectedFile(files[0]);
  }

  function handleSubmit() {
    if (!subject.trim() || !description.trim()) return;
    
    setIsSubmitting(true);
    // TODO: Replace with actual API call
    const data: CreateTicketRequest = {
      category,
      subject,
      description,
      attachment: selectedFile || undefined,
    };
    
    // Mock submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
    }, 1000);
  }

  function handleClose() {
    if (success) {
      onClose();
    } else {
      onClose();
    }
  }

  if (success) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-ticket-title"
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} aria-hidden="true" />
        <div className="relative z-10 w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-6 py-8 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#E6F7F1] flex items-center justify-center">
              <Check className="w-8 h-8 text-[#00A86B]" aria-hidden="true" />
            </div>
            <h2 id="create-ticket-title" className="font-heading font-semibold text-[#0D1B2E] text-lg">
              Ticket Created Successfully
            </h2>
            <p className="text-sm text-[#64748B]">
              Your support ticket has been submitted. Our team will review it and get back to you shortly.
            </p>
            <button onClick={handleClose} className="w-full py-3 rounded-full bg-[#0F2B5B] text-white font-semibold hover:bg-[#1A3F7A] transition-all mt-2">
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-ticket-title"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} aria-hidden="true" />

      <div className="relative z-10 w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2E8F0]">
          <h2 id="create-ticket-title" className="font-heading font-semibold text-[#0D1B2E] text-lg">
            Create New Ticket
          </h2>
          <button onClick={handleClose} aria-label="Close" className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#0D1B2E] hover:bg-[#F5F7FA] transition-all">
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4">
          {/* Category */}
          <div>
            <label htmlFor="category-select" className="text-xs font-semibold text-[#64748B] block mb-1.5">
              Category
            </label>
            <select
              id="category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value as TicketCategory)}
              className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-[#0D1B2E] focus:border-[#0F2B5B] focus:ring-2 focus:ring-[#0F2B5B]/10 outline-none transition-all"
            >
              <option value={TicketCategory.BILLING}>Billing</option>
              <option value={TicketCategory.TECHNICAL}>Technical</option>
              <option value={TicketCategory.ACCOUNT}>Account</option>
              <option value={TicketCategory.OTHER}>Other</option>
            </select>
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="subject-input" className="text-xs font-semibold text-[#64748B] block mb-1.5">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              id="subject-input"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of your issue"
              className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-[#0D1B2E] focus:border-[#0F2B5B] focus:ring-2 focus:ring-[#0F2B5B]/10 outline-none transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description-textarea" className="text-xs font-semibold text-[#64748B] block mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide detailed information about your issue..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-[#0D1B2E] focus:border-[#0F2B5B] focus:ring-2 focus:ring-[#0F2B5B]/10 outline-none transition-all resize-none"
            />
          </div>

          {/* File Upload */}
          <div>
            <p className="text-xs font-semibold text-[#64748B] mb-1.5">
              Attachment (Optional)
            </p>
            <label
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                isDragging ? 'border-[#0F2B5B] bg-[#F5F7FA]' : 'border-[#E2E8F0] hover:border-[#0F2B5B]/40'
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileChange(e.dataTransfer.files); }}
              aria-label="Upload attachment file"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,application/pdf"
                onChange={(e) => handleFileChange(e.target.files)}
                className="hidden"
                aria-label="Attachment file"
              />
              {selectedFile ? (
                <div className="flex items-center justify-center gap-2">
                  <Paperclip className="w-4 h-4 text-[#00A86B]" aria-hidden="true" />
                  <span className="text-sm font-medium text-[#0D1B2E]">{selectedFile.name}</span>
                </div>
              ) : (
                <>
                  <Paperclip className="w-6 h-6 text-[#94A3B8] mx-auto mb-2" aria-hidden="true" />
                  <p className="text-sm text-[#64748B]">Drop file here or tap to upload</p>
                  <p className="text-xs text-[#94A3B8] mt-0.5">JPG, PNG, PDF — max 5MB</p>
                </>
              )}
            </label>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!subject.trim() || !description.trim() || isSubmitting}
            className="w-full py-3 rounded-full bg-[#0F2B5B] text-white font-semibold hover:bg-[#1A3F7A] transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#0F2B5B] focus-visible:outline-none"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
          </button>
        </div>
      </div>
    </div>
  );
}
