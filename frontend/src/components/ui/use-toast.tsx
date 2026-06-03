import { createContext, useContext, useEffect, useMemo, useState, useRef, useCallback, type ReactNode } from 'react';
import { CheckCircle2, Info, TriangleAlert, XCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastVariant = 'default' | 'success' | 'info' | 'error';

export interface ToastOptions {
  id?: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

interface ToastItem extends Required<Pick<ToastOptions, 'title'>> {
  id: string;
  description?: string;
  variant: ToastVariant;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextValue {
  toasts: ToastItem[];
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function variantClasses(variant: ToastVariant) {
  switch (variant) {
    case 'success':
      return 'border-emerald-200 bg-emerald-50 text-emerald-950';
    case 'info':
      return 'border-sky-200 bg-sky-50 text-sky-950';
    case 'error':
      return 'border-rose-200 bg-rose-50 text-rose-950';
    default:
      return 'border-slate-200 bg-white text-slate-950';
  }
}

function variantIcon(variant: ToastVariant) {
  switch (variant) {
    case 'success':
      return CheckCircle2;
    case 'info':
      return Info;
    case 'error':
      return XCircle;
    default:
      return TriangleAlert;
  }
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timeoutsRef = useRef(new Map<string, number>());

  const dismiss = useCallback((id: string) => {
    if (timeoutsRef.current.has(id)) {
      clearTimeout(timeoutsRef.current.get(id));
      timeoutsRef.current.delete(id);
    }
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback((options: ToastOptions) => {
    const id = options.id ?? createId();
    const item: ToastItem = {
      id,
      title: options.title,
      description: options.description,
      variant: options.variant ?? 'default',
      action: options.action,
    };

    setToasts((current) => [item, ...current].slice(0, 4));

    const duration = options.duration ?? 4500;
    const timeoutId = window.setTimeout(() => dismiss(id), duration);
    timeoutsRef.current.set(id, timeoutId);
    
    return id;
  }, [dismiss]);

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
      timeouts.clear();
    };
  }, []);

  const value = useMemo(() => ({ toasts, toast, dismiss }), [toasts, toast, dismiss]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return { toast: context.toast, dismiss: context.dismiss, toasts: context.toasts };
}

export function Toaster() {
  const { toasts, dismiss } = useToast();

  useEffect(() => {
    if (!toasts.length) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && toasts[0]) {
        dismiss(toasts[0].id);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [dismiss, toasts]);

  return (
    <div className="fixed inset-x-0 top-0 z-[80] flex justify-center px-4 pt-4 sm:inset-x-auto sm:right-4 sm:left-auto sm:flex-col sm:items-end sm:pt-4">
      <div className="flex w-full max-w-md flex-col gap-3 sm:w-[22rem]">
        {toasts.map((toastItem, index) => {
          const Icon = variantIcon(toastItem.variant);
          return (
            <div
              key={toastItem.id}
              className={cn(
                'pointer-events-auto rounded-2xl border p-4 shadow-lg backdrop-blur-sm transition-all duration-200 ease-out animate-fade-up',
                variantClasses(toastItem.variant),
              )}
              style={{ animationDelay: `${index * 75}ms` }}
              role="status"
              aria-live="polite"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/70">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{toastItem.title}</p>
                  {toastItem.description && (
                    <p className="mt-1 text-sm text-slate-600">{toastItem.description}</p>
                  )}
                  {toastItem.action && (
                    <button
                      onClick={toastItem.action.onClick}
                      className="mt-3 rounded-full bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
                    >
                      {toastItem.action.label}
                    </button>
                  )}
                </div>
                <button
                  onClick={() => dismiss(toastItem.id)}
                  className="rounded-full p-1 text-slate-500 transition-colors hover:bg-black/5 hover:text-slate-900"
                  aria-label="Dismiss notification"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
