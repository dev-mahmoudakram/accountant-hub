'use client';

import { useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ReactSelect, { MultiValue, StylesConfig } from 'react-select';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { JobCategory } from '@/types/job';

interface Option {
  value: string;
  label: string;
}

interface JobFiltersPanelProps {
  categories: JobCategory[];
}

const SORT_OPTIONS: Option[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'highest_budget', label: 'Highest budget' },
];

const sharedControlStyles = {
  control: (base: object, { isFocused }: { isFocused: boolean }) => ({
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
  placeholder: (base: object) => ({ ...base, color: '#9ca3af', fontSize: '0.875rem' }),
  singleValue: (base: object) => ({ ...base, color: '#0a0a0a', fontSize: '0.875rem' }),
  input: (base: object) => ({ ...base, color: '#0a0a0a', fontSize: '0.875rem' }),
  menu: (base: object) => ({
    ...base,
    borderRadius: '0.75rem',
    border: '1px solid #e5e7eb',
    boxShadow: '0 8px 24px -4px rgba(0,0,0,0.12)',
    zIndex: 50,
    overflow: 'hidden',
  }),
  option: (
    base: object,
    { isSelected, isFocused }: { isSelected: boolean; isFocused: boolean }
  ) => ({
    ...base,
    fontSize: '0.875rem',
    backgroundColor: isSelected ? '#019a51' : isFocused ? '#f9fafb' : '#fff',
    color: isSelected ? '#fff' : '#0a0a0a',
    cursor: 'pointer',
    '&:active': { backgroundColor: '#017a41' },
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base: object) => ({
    ...base,
    color: '#9ca3af',
    padding: '0 8px',
    '&:hover': { color: '#6b7280' },
  }),
  clearIndicator: (base: object) => ({
    ...base,
    color: '#9ca3af',
    padding: '0 4px',
    cursor: 'pointer',
    '&:hover': { color: '#6b7280' },
  }),
};

const categorySelectStyles: StylesConfig<Option, true> = {
  ...sharedControlStyles,
  multiValue: (base) => ({
    ...base,
    backgroundColor: '#e6f7ef',
    borderRadius: '0.375rem',
    border: '1px solid rgba(1,154,81,0.2)',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: '#019a51',
    fontSize: '0.75rem',
    fontWeight: '500',
    paddingLeft: '6px',
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: '#019a51',
    borderRadius: '0 0.375rem 0.375rem 0',
    '&:hover': { backgroundColor: '#019a51', color: '#fff' },
  }),
};

const sortSelectStyles: StylesConfig<Option, false> = { ...sharedControlStyles };

export default function JobFiltersPanel({ categories }: JobFiltersPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const categoryParam = searchParams.get('category') ?? '';
  const sort = searchParams.get('sort') ?? 'newest';
  const urlSearch = searchParams.get('search') ?? '';
  const urlBudgetMin = searchParams.get('budget_min') ?? '';
  const urlBudgetMax = searchParams.get('budget_max') ?? '';

  const [search, setSearch] = useState(urlSearch);
  const [committedSearch, setCommittedSearch] = useState(urlSearch);
  if (committedSearch !== urlSearch) { setCommittedSearch(urlSearch); setSearch(urlSearch); }

  const [budgetMin, setBudgetMin] = useState(urlBudgetMin);
  const [committedBudgetMin, setCommittedBudgetMin] = useState(urlBudgetMin);
  if (committedBudgetMin !== urlBudgetMin) { setCommittedBudgetMin(urlBudgetMin); setBudgetMin(urlBudgetMin); }

  const [budgetMax, setBudgetMax] = useState(urlBudgetMax);
  const [committedBudgetMax, setCommittedBudgetMax] = useState(urlBudgetMax);
  if (committedBudgetMax !== urlBudgetMax) { setCommittedBudgetMax(urlBudgetMax); setBudgetMax(urlBudgetMax); }

  function pushParam(key: string, value: string) {
    const base = new URLSearchParams(window.location.search);
    base.delete('page');
    if (value && !(key === 'sort' && value === 'newest')) {
      base.set(key, value);
    } else {
      base.delete(key);
    }
    router.push(`/jobs${base.toString() ? `?${base.toString()}` : ''}`);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => pushParam('search', value), 400);
  }

  function handleBudgetChange(key: 'budget_min' | 'budget_max', value: string) {
    if (key === 'budget_min') setBudgetMin(value);
    else setBudgetMax(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => pushParam(key, value), 600);
  }

  function handleCategoryChange(selected: MultiValue<Option>) {
    const value = selected.map((o) => o.value).join(',');
    pushParam('category', value);
  }

  const categoryOptions: Option[] = categories.map((c) => ({ value: c.slug, label: c.name }));
  const selectedSlugs = categoryParam ? categoryParam.split(',').filter(Boolean) : [];
  const categoryValue = categoryOptions.filter((o) => selectedSlugs.includes(o.value));
  const sortValue = SORT_OPTIONS.find((o) => o.value === sort) ?? SORT_OPTIONS[0];
  const hasFilters = !!(urlSearch || categoryParam || urlBudgetMin || urlBudgetMax || sort !== 'newest');

  return (
    <div className="bg-white border border-border rounded-2xl shadow-sm">
      {/* Panel header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="text-sm font-semibold text-ink">Filters</span>
        </div>
        {hasFilters && (
          <button
            type="button"
            onClick={() => router.push('/jobs')}
            className="text-xs text-brand hover:underline font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="p-5 space-y-5">
        <Input
          label="Search"
          placeholder="e.g. Tax filing, Bookkeeping…"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-ink">Category</label>
          <ReactSelect<Option, true>
            isMulti
            options={categoryOptions}
            value={categoryValue}
            onChange={handleCategoryChange}
            placeholder="All categories"
            isClearable
            closeMenuOnSelect={false}
            styles={categorySelectStyles}
            instanceId="category-select"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink block mb-1.5">Budget range</label>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label=""
              type="number"
              placeholder="Min $"
              value={budgetMin}
              min={0}
              onChange={(e) => handleBudgetChange('budget_min', e.target.value)}
            />
            <Input
              label=""
              type="number"
              placeholder="Max $"
              value={budgetMax}
              min={0}
              onChange={(e) => handleBudgetChange('budget_max', e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-ink">Sort by</label>
          <ReactSelect<Option, false>
            options={SORT_OPTIONS}
            value={sortValue}
            onChange={(option) => pushParam('sort', option?.value ?? 'newest')}
            isSearchable={false}
            styles={sortSelectStyles}
            instanceId="sort-select"
          />
        </div>

        {hasFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full border border-border text-muted hover:text-ink"
            onClick={() => router.push('/jobs')}
          >
            Clear all filters
          </Button>
        )}
      </div>
    </div>
  );
}
