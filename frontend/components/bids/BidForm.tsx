'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { api } from '@/lib/api';

const schema = z.object({
  proposed_price: z.number({ error: 'Enter a valid price' }).min(1, 'Must be at least $1'),
  estimated_delivery_time: z.string().min(1, 'Required').max(60, 'Max 60 characters'),
  cover_letter: z.string().min(50, 'Must be at least 50 characters'),
  experience_summary: z.string().min(30, 'Must be at least 30 characters'),
});

type FormValues = z.infer<typeof schema>;

interface BidFormProps {
  jobId: number;
  onSuccess: () => void;
}

export default function BidForm({ jobId, onSuccess }: BidFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormValues) {
    setServerError(null);
    try {
      await api.post(`/jobs/${jobId}/bids`, data);
      toast.success('Bid submitted successfully!');
      onSuccess();
    } catch (err: unknown) {
      const error = err as { status?: number; message?: string; errors?: Record<string, string[]> };
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && <Alert variant="error">{serverError}</Alert>}

      <Input
        label="Proposed Price ($)"
        type="number"
        placeholder="e.g. 500"
        min={1}
        error={errors.proposed_price?.message}
        {...register('proposed_price', { valueAsNumber: true })}
      />

      <Input
        label="Estimated Delivery Time"
        placeholder="e.g. 3 business days"
        maxLength={60}
        error={errors.estimated_delivery_time?.message}
        {...register('estimated_delivery_time')}
      />

      <Textarea
        label="Cover Letter"
        placeholder="Describe how you'll approach this job... (min 50 characters)"
        rows={5}
        error={errors.cover_letter?.message}
        {...register('cover_letter')}
      />

      <Textarea
        label="Relevant Experience"
        placeholder="Summarize your relevant accounting experience... (min 30 characters)"
        rows={4}
        error={errors.experience_summary?.message}
        {...register('experience_summary')}
      />

      <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full">
        Submit Bid
      </Button>
    </form>
  );
}
