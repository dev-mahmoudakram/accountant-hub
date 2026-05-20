'use client';

import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import ReactSelect, { StylesConfig } from 'react-select';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { api } from '@/lib/api';
import { Bid } from '@/types/bid';
import { JobDetail } from '@/types/job';
import { ApiResponse } from '@/types/api';
import { DeliveryOption, deliveryOptionsUpTo } from '@/lib/deliveryOptions';

interface EditBidModalProps {
  open: boolean;
  bid: Bid | null;
  onClose: () => void;
  onSaved: () => void;
}

function buildSchema(budgetMin: number, budgetMax: number, allowedDelivery: string[]) {
  return z.object({
    proposed_price: z
      .number({ error: 'Enter a valid price' })
      .min(budgetMin, `Must be at least $${budgetMin}`)
      .max(budgetMax, `Must be at most $${budgetMax}`),
    estimated_delivery_time: z
      .string()
      .min(1, 'Required')
      .refine((v) => allowedDelivery.includes(v), `Must not exceed the job's expected delivery time`),
    cover_letter: z.string().min(50, 'Must be at least 50 characters'),
    experience_summary: z.string().min(30, 'Must be at least 30 characters'),
  });
}

type FormValues = z.infer<ReturnType<typeof buildSchema>>;

const selectStyles: StylesConfig<DeliveryOption, false> = {
  control: (base, { isFocused }) => ({
    ...base,
    minHeight: '40px',
    borderRadius: '0.5rem',
    borderColor: isFocused ? '#019a51' : '#e5e7eb',
    boxShadow: isFocused ? '0 0 0 3px rgba(1,154,81,0.15)' : 'none',
    backgroundColor: '#fff',
    fontSize: '0.875rem',
    transition: 'border-color 150ms, box-shadow 150ms',
    '&:hover': { borderColor: isFocused ? '#019a51' : '#d1d5db' },
  }),
  placeholder: (base) => ({ ...base, color: '#9ca3af', fontSize: '0.875rem' }),
  singleValue: (base) => ({ ...base, color: '#0a0a0a', fontSize: '0.875rem' }),
  input: (base) => ({ ...base, color: '#0a0a0a', fontSize: '0.875rem' }),
  menu: (base) => ({
    ...base,
    borderRadius: '0.75rem',
    border: '1px solid #e5e7eb',
    boxShadow: '0 8px 24px -4px rgba(0,0,0,0.12)',
    zIndex: 70,
    overflow: 'hidden',
  }),
  option: (base, { isSelected, isFocused }) => ({
    ...base,
    fontSize: '0.875rem',
    backgroundColor: isSelected ? '#019a51' : isFocused ? '#f9fafb' : '#fff',
    color: isSelected ? '#fff' : '#0a0a0a',
    cursor: 'pointer',
    '&:active': { backgroundColor: '#017a41' },
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base) => ({ ...base, color: '#9ca3af', paddingRight: '10px' }),
};

function CharCount({ value, min }: { value: string; min: number }) {
  const len = value?.length ?? 0;
  const met = len >= min;
  return <span className={`text-xs ${met ? 'text-brand' : 'text-muted'}`}>{len}/{min} min</span>;
}

export default function EditBidModal({ open, bid, onClose, onSaved }: EditBidModalProps) {
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch the full job whenever the modal opens to know its budget + expected delivery.
  useEffect(() => {
    if (!open || !bid) return;
    setLoading(true);
    api.get<ApiResponse<JobDetail>>(`/jobs/${bid.job.id}`)
      .then((res) => setJob(res.data))
      .catch(() => toast.error('Could not load the job for this bid.'))
      .finally(() => setLoading(false));
  }, [open, bid]);

  const budgetMin = job?.budget_min ?? 1;
  const budgetMax = job?.budget_max ?? Number.MAX_SAFE_INTEGER;
  const deliveryOptions = useMemo(
    () => (job ? deliveryOptionsUpTo(job.expected_delivery_time) : []),
    [job],
  );
  const allowedDelivery = useMemo(() => deliveryOptions.map((o) => o.value), [deliveryOptions]);
  const schema = useMemo(
    () => buildSchema(budgetMin, budgetMax, allowedDelivery),
    [budgetMin, budgetMax, allowedDelivery],
  );

  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  // Once job and bid are both available, populate the form with the bid's current values.
  useEffect(() => {
    if (open && bid && job) {
      reset({
        proposed_price: bid.proposed_price,
        estimated_delivery_time: bid.estimated_delivery_time,
        cover_letter: bid.cover_letter,
        experience_summary: bid.experience_summary,
      });
    }
  }, [open, bid, job, reset]);

  const coverLetter = useWatch({ control, name: 'cover_letter', defaultValue: '' });
  const experienceSummary = useWatch({ control, name: 'experience_summary', defaultValue: '' });

  // Lock body scroll while open + handle Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, isSubmitting, onClose]);

  async function onSubmit(data: FormValues) {
    if (!bid) return;
    try {
      await api.patch(`/my-bids/${bid.id}`, data);
      toast.success('Bid updated successfully.');
      onSaved();
      onClose();
    } catch (err: unknown) {
      const error = err as { status?: number; message?: string; errors?: Record<string, string[]> };
      if (error.status === 422 && error.errors) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          setError(field as keyof FormValues, { message: messages[0] });
        });
        const firstMessage = Object.values(error.errors).flat()[0];
        toast.error(firstMessage ?? 'Please review the highlighted fields and try again.');
      } else if (error.status === 403) {
        toast.error('This bid can no longer be edited.');
      } else {
        toast.error(error.message ?? 'Could not update the bid. Please try again.');
      }
    }
  }

  return (
    <AnimatePresence>
      {open && bid && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/50"
            onClick={() => { if (!isSubmitting) onClose(); }}
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-bid-title"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-lg my-8 bg-white rounded-2xl shadow-2xl border border-border overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 id="edit-bid-title" className="text-base font-semibold text-ink">Edit your bid</h2>
                <p className="text-xs text-muted mt-0.5 truncate">{bid.job.title}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                aria-label="Close"
                className="shrink-0 p-1 text-muted hover:text-ink transition-colors disabled:opacity-40 focus-visible:outline-none"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {loading || !job ? (
              <div className="p-8 text-center text-sm text-muted">Loading job details…</div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="p-6 space-y-5">
                <Input
                  label="Proposed Price ($)"
                  type="number"
                  error={errors.proposed_price?.message}
                  hint={`Must be between $${budgetMin} and $${budgetMax}`}
                  {...register('proposed_price', { valueAsNumber: true })}
                />

                <div>
                  <label htmlFor="edit-delivery" className="block text-sm font-medium text-ink mb-1.5">
                    Delivery Time
                  </label>
                  <Controller
                    name="estimated_delivery_time"
                    control={control}
                    render={({ field }) => (
                      <ReactSelect<DeliveryOption, false>
                        inputId="edit-delivery"
                        options={deliveryOptions}
                        value={deliveryOptions.find((o) => o.value === field.value) ?? null}
                        onChange={(opt) => field.onChange(opt?.value ?? '')}
                        onBlur={field.onBlur}
                        styles={selectStyles}
                        placeholder="Select delivery time"
                        isSearchable={false}
                        instanceId="edit-bid-delivery"
                      />
                    )}
                  />
                  <p className="text-xs text-muted mt-1">
                    Must not exceed the job&apos;s expected delivery:{' '}
                    <span className="font-medium text-ink">{job.expected_delivery_time}</span>
                  </p>
                  {errors.estimated_delivery_time && (
                    <p className="text-xs text-red-500 mt-1">{errors.estimated_delivery_time.message}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-ink">Cover Letter</label>
                    <CharCount value={coverLetter} min={50} />
                  </div>
                  <textarea
                    rows={4}
                    className={[
                      'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink resize-y',
                      'focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand',
                      errors.cover_letter ? 'border-red-400' : 'border-border hover:border-gray-300',
                    ].join(' ')}
                    {...register('cover_letter')}
                  />
                  {errors.cover_letter && (
                    <p className="text-xs text-red-500 mt-1">{errors.cover_letter.message}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-ink">Relevant Experience</label>
                    <CharCount value={experienceSummary} min={30} />
                  </div>
                  <textarea
                    rows={3}
                    className={[
                      'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink resize-y',
                      'focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand',
                      errors.experience_summary ? 'border-red-400' : 'border-border hover:border-gray-300',
                    ].join(' ')}
                    {...register('experience_summary')}
                  />
                  {errors.experience_summary && (
                    <p className="text-xs text-red-500 mt-1">{errors.experience_summary.message}</p>
                  )}
                </div>

                <div className="flex gap-2 justify-end pt-2 border-t border-border">
                  <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" loading={isSubmitting}>
                    Save Changes
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
