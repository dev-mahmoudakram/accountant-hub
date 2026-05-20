'use client';

import { useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { api } from '@/lib/api';
import { fadeUp } from '@/lib/animations';

function buildSchema(budgetMin: number, budgetMax: number) {
  return z.object({
    proposed_price: z
      .number({ error: 'Enter a valid price' })
      .min(budgetMin, `Must be at least $${budgetMin}`)
      .max(budgetMax, `Must be at most $${budgetMax}`),
    estimated_delivery_time: z.string().min(1, 'Required').max(60, 'Max 60 characters'),
    cover_letter: z.string().min(50, 'Must be at least 50 characters'),
    experience_summary: z.string().min(30, 'Must be at least 30 characters'),
  });
}

type FormValues = z.infer<ReturnType<typeof buildSchema>>;

interface BidFormProps {
  jobId: number;
  budgetMin: number;
  budgetMax: number;
  onSuccess: () => void;
}

function CharCount({ value, min }: { value: string; min: number }) {
  const len = value?.length ?? 0;
  const met = len >= min;
  return (
    <span className={`text-xs ${met ? 'text-brand' : 'text-muted'}`}>
      {len}/{min} min
    </span>
  );
}

export default function BidForm({ jobId, budgetMin, budgetMax, onSuccess }: BidFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const schema = useMemo(() => buildSchema(budgetMin, budgetMax), [budgetMin, budgetMax]);

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const coverLetter = useWatch({ control, name: 'cover_letter', defaultValue: '' });
  const experienceSummary = useWatch({ control, name: 'experience_summary', defaultValue: '' });

  async function onSubmit(data: FormValues) {
    setServerError(null);
    try {
      await api.post(`/jobs/${jobId}/bids`, data);
      toast.success('Bid submitted successfully!');
      onSuccess();
    } catch (err: unknown) {
      const error = err as {
        status?: number;
        message?: string;
        errors?: Record<string, string[]>;
      };
      if (error.status === 422 && error.errors) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          setError(field as keyof FormValues, { message: messages[0] });
        });
      } else if (error.status === 409) {
        setServerError('You have already submitted a bid for this job.');
      } else {
        setServerError(error.message ?? 'Something went wrong. Please try again.');
      }
    }
  }

  return (
    <motion.form
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      {serverError && <Alert variant="error">{serverError}</Alert>}

      {/* Pricing & timeline row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Proposed Price ($)"
          type="number"
          placeholder={`e.g. ${budgetMin}`}
          min={budgetMin}
          max={budgetMax}
          error={errors.proposed_price?.message}
          hint={`Must be between $${budgetMin} and $${budgetMax}`}
          {...register('proposed_price', { valueAsNumber: true })}
        />
        <Input
          label="Delivery Time"
          placeholder="e.g. 3 business days"
          maxLength={60}
          error={errors.estimated_delivery_time?.message}
          hint="How long will it take?"
          {...register('estimated_delivery_time')}
        />
      </div>

      {/* Cover letter */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-medium text-ink">Cover Letter</label>
          <CharCount value={coverLetter} min={50} />
        </div>
        <textarea
          placeholder="Describe your approach, why you're the right fit, and how you'll deliver results… (min 50 characters)"
          rows={5}
          className={[
            'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink',
            'placeholder:text-muted/70 resize-y',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand',
            errors.cover_letter
              ? 'border-red-400 focus:ring-red-300/40 focus:border-red-400'
              : 'border-border hover:border-gray-300',
          ].join(' ')}
          {...register('cover_letter')}
        />
        {errors.cover_letter && (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd" />
            </svg>
            {errors.cover_letter.message}
          </p>
        )}
      </div>

      {/* Experience summary */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-medium text-ink">Relevant Experience</label>
          <CharCount value={experienceSummary} min={30} />
        </div>
        <textarea
          placeholder="Summarize your accounting background and relevant experience… (min 30 characters)"
          rows={4}
          className={[
            'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink',
            'placeholder:text-muted/70 resize-y',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand',
            errors.experience_summary
              ? 'border-red-400 focus:ring-red-300/40 focus:border-red-400'
              : 'border-border hover:border-gray-300',
          ].join(' ')}
          {...register('experience_summary')}
        />
        {errors.experience_summary && (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd" />
            </svg>
            {errors.experience_summary.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Submitting…' : 'Submit Bid'}
      </Button>

      <p className="text-xs text-muted text-center">
        Your bid will be visible to the job poster for review.
      </p>
    </motion.form>
  );
}
