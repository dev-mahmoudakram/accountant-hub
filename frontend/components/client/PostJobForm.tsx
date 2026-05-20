'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import ReactSelect, { StylesConfig } from 'react-select';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { JobCategory, JobDetail } from '@/types/job';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import AttachmentDropzone from '@/components/client/AttachmentDropzone';
import { DELIVERY_OPTIONS as DELIVERY_DURATIONS } from '@/lib/deliveryOptions';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Option<T = string> {
  value: T;
  label: string;
}

// ─── Validation ───────────────────────────────────────────────────────────────

const schema = z.object({
  category_id: z.number({ error: 'Please select a category' }).min(1, 'Please select a category'),
  title: z.string().min(5, 'Title must be at least 5 characters').max(180),
  company_name: z.string().min(2, 'Company name is required').max(140),
  short_description: z.string().min(10, 'Brief description is required').max(255),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  budget_min: z.number({ error: 'Enter a valid amount' }).min(1, 'Minimum budget must be at least $1'),
  budget_max: z.number({ error: 'Enter a valid amount' }).min(1, 'Maximum budget must be at least $1'),
  deadline: z.string().min(1, 'Deadline is required'),
  expected_delivery_time: z.string().min(1, 'Delivery time is required'),
  required_skills: z
    .array(z.object({ value: z.string().min(1) }))
    .min(1, 'Add at least one required skill'),
}).refine((d) => d.budget_max >= d.budget_min, {
  message: 'Maximum budget must be ≥ minimum budget',
  path: ['budget_max'],
});

type FormValues = z.infer<typeof schema>;

// ─── Constants ────────────────────────────────────────────────────────────────

const DELIVERY_OPTIONS: Option[] = DELIVERY_DURATIONS.map((d) => ({ value: d.value, label: d.label }));

// ─── React Select shared styles (matches the project's brand) ────────────────

const selectStyles: StylesConfig<Option<number | string>, false> = {
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
    zIndex: 50,
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

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  /** When provided the form operates in edit mode */
  initialData?: JobDetail;
  jobId?: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PostJobForm({ initialData, jobId }: Props) {
  const router = useRouter();
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: standardSchemaResolver(schema),
    defaultValues: initialData
      ? {
          category_id: initialData.category.id,
          title: initialData.title,
          company_name: initialData.company_name,
          short_description: initialData.short_description,
          description: initialData.description,
          budget_min: initialData.budget_min,
          budget_max: initialData.budget_max,
          deadline: initialData.deadline,
          expected_delivery_time: initialData.expected_delivery_time,
          required_skills: initialData.required_skills.map((s) => ({ value: s })),
        }
      : { required_skills: [] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'required_skills' });

  useEffect(() => {
    api.get<PaginatedResponse<JobCategory>>('/categories').then((res) => {
      setCategories(res.data);
    });
  }, []);

  // ─── Skill tag helpers ───────────────────────────────────────────────────

  function addSkill() {
    const skill = skillInput.trim();
    if (!skill) return;
    append({ value: skill });
    setSkillInput('');
  }

  function handleSkillKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill();
    }
  }

  // ─── Submit ──────────────────────────────────────────────────────────────

  async function onSubmit(data: FormValues) {
    const payload = { ...data, required_skills: data.required_skills.map((s) => s.value) };

    try {
      if (isEdit && jobId) {
        await api.patch(`/client/jobs/${jobId}`, payload);
        toast.success('Job updated successfully.');
        router.push(`/client/jobs/${jobId}`);
      } else {
        const res = await api.post<ApiResponse<JobDetail>>('/client/jobs', payload);
        const newJobId = res.data.id;
        for (const file of pendingFiles) {
          const form = new FormData();
          form.append('file', file);
          await api.postForm(`/client/jobs/${newJobId}/attachments`, form);
        }
        toast.success('Job posted successfully!');
        router.push(`/client/jobs/${newJobId}`);
      }
    } catch (err: unknown) {
      const error = err as { status?: number; message?: string; errors?: Record<string, string[]> };
      if (error.status === 422 && error.errors) {
        // Set each field's error inline so users see what's wrong next to the input,
        // and surface a short toast so they notice even when scrolled to the bottom.
        Object.entries(error.errors).forEach(([field, messages]) => {
          setError(field as keyof FormValues, { message: messages[0] });
        });
        const firstMessage = Object.values(error.errors).flat()[0];
        toast.error(firstMessage ?? 'Please review the highlighted fields and try again.');
      } else {
        toast.error(error.message ?? 'Something went wrong. Please try again.');
      }
    }
  }

  // ─── Derived select options ──────────────────────────────────────────────

  const categoryOptions: Option<number>[] = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* ── Job Details ─────────────────────────────────────────────────── */}
      <div className="bg-white border border-border rounded-2xl p-6 space-y-5">
        <h2 className="text-base font-semibold text-ink">Job Details</h2>

        <Input
          label="Job Title"
          placeholder="e.g. Bookkeeper Needed for Small Business"
          error={errors.title?.message}
          {...register('title')}
        />

        {/* Category — React Select */}
        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">Category</label>
          <Controller
            name="category_id"
            control={control}
            render={({ field }) => (
              <ReactSelect<Option<number>, false>
                inputId="category_id"
                options={categoryOptions}
                value={categoryOptions.find((o) => o.value === field.value) ?? null}
                onChange={(opt) => field.onChange(opt?.value ?? 0)}
                onBlur={field.onBlur}
                styles={selectStyles as StylesConfig<Option<number>, false>}
                placeholder="Select a category"
                isSearchable
              />
            )}
          />
          {errors.category_id && (
            <p className="mt-1 text-xs text-red-500">{errors.category_id.message}</p>
          )}
        </div>

        <Input
          label="Company Name"
          placeholder="e.g. Acme Corp"
          error={errors.company_name?.message}
          {...register('company_name')}
        />

        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">Short Description</label>
          <input
            type="text"
            placeholder="One-line summary shown on job cards (max 255 chars)"
            maxLength={255}
            className="w-full rounded-lg border border-border px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
            {...register('short_description')}
          />
          {errors.short_description && (
            <p className="mt-1 text-xs text-red-500">{errors.short_description.message}</p>
          )}
        </div>

        <Textarea
          label="Full Description"
          placeholder="Describe the role, responsibilities, and requirements in detail (min 50 characters)"
          rows={6}
          error={errors.description?.message}
          {...register('description')}
        />
      </div>

      {/* ── Budget & Timeline ────────────────────────────────────────────── */}
      <div className="bg-white border border-border rounded-2xl p-6 space-y-5">
        <h2 className="text-base font-semibold text-ink">Budget & Timeline</h2>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Budget Min ($)"
            type="number"
            min={1}
            placeholder="500"
            error={errors.budget_min?.message}
            {...register('budget_min', { valueAsNumber: true })}
          />
          <Input
            label="Budget Max ($)"
            type="number"
            min={1}
            placeholder="2000"
            error={errors.budget_max?.message}
            {...register('budget_max', { valueAsNumber: true })}
          />
        </div>

        <Input
          label="Application Deadline"
          type="date"
          error={errors.deadline?.message}
          {...register('deadline')}
        />

        {/* Expected Delivery Time — React Select */}
        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">
            Expected Delivery Time
          </label>
          <Controller
            name="expected_delivery_time"
            control={control}
            render={({ field }) => (
              <ReactSelect<Option, false>
                inputId="expected_delivery_time"
                options={DELIVERY_OPTIONS}
                value={DELIVERY_OPTIONS.find((o) => o.value === field.value) ?? null}
                onChange={(opt) => field.onChange(opt?.value ?? '')}
                onBlur={field.onBlur}
                styles={selectStyles as StylesConfig<Option, false>}
                placeholder="Select timeframe"
                isSearchable={false}
              />
            )}
          />
          {errors.expected_delivery_time && (
            <p className="mt-1 text-xs text-red-500">{errors.expected_delivery_time.message}</p>
          )}
        </div>
      </div>

      {/* ── Required Skills ──────────────────────────────────────────────── */}
      <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-ink">Required Skills</h2>

        {fields.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {fields.map((field, index) => (
              <span
                key={field.id}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-sm font-medium"
              >
                {field.value}
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-brand/60 hover:text-brand transition-colors focus-visible:outline-none"
                  aria-label={`Remove ${field.value}`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleSkillKeyDown}
            placeholder="Type a skill and press Enter (e.g. QuickBooks)"
            className="flex-1 rounded-lg border border-border px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
          />
          <Button type="button" variant="outline" size="sm" onClick={addSkill}>
            Add
          </Button>
        </div>

        {errors.required_skills && (
          <p className="text-xs text-red-500">
            {typeof errors.required_skills === 'object' && 'message' in errors.required_skills
              ? (errors.required_skills as { message: string }).message
              : 'Add at least one required skill'}
          </p>
        )}
        <p className="text-xs text-muted">Press Enter or comma to add · click × to remove</p>
      </div>

      {/* ── Attachments ──────────────────────────────────────────────────── */}
      <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-ink">Attachments</h2>
        {isEdit && <p className="text-xs text-muted">Files are saved immediately when uploaded or removed.</p>}
        <AttachmentDropzone
          jobId={isEdit ? jobId : undefined}
          initialAttachments={initialData?.attachments ?? []}
          onPendingChange={!isEdit ? setPendingFiles : undefined}
        />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" variant="primary" size="lg" loading={isSubmitting}>
          {isEdit ? 'Save Changes' : 'Post Job'}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
