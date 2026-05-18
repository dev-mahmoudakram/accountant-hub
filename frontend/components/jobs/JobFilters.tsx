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
    minHeight: '38px',
    borderRadius: '0.5rem',
    borderColor: isFocused ? '#019a51' : '#e5e7eb',
    boxShadow: isFocused ? '0 0 0 2px #019a51' : 'none',
    backgroundColor: '#fff',
    fontSize: '0.875rem',
    '&:hover': { borderColor: isFocused ? '#019a51' : '#d1d5db' },
  }),
  placeholder: (base: object) => ({ ...base, color: '#6b7280', fontSize: '0.875rem' }),
  singleValue: (base: object) => ({ ...base, color: '#0a0a0a', fontSize: '0.875rem' }),
  input: (base: object) => ({ ...base, color: '#0a0a0a', fontSize: '0.875rem' }),
  menu: (base: object) => ({
    ...base,
    borderRadius: '0.5rem',
    border: '1px solid #e5e7eb',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    zIndex: 50,
  }),
  option: (base: object, { isSelected, isFocused }: { isSelected: boolean; isFocused: boolean }) => ({
    ...base,
    fontSize: '0.875rem',
    backgroundColor: isSelected ? '#019a51' : isFocused ? '#f9fafb' : '#fff',
    color: isSelected ? '#fff' : '#0a0a0a',
    cursor: 'pointer',
    '&:active': { backgroundColor: '#017a41' },
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base: object) => ({ ...base, color: '#6b7280', padding: '0 8px' }),
  clearIndicator: (base: object) => ({ ...base, color: '#6b7280', padding: '0 4px', cursor: 'pointer' }),
};

const categorySelectStyles: StylesConfig<Option, true> = {
  ...sharedControlStyles,
  multiValue: (base) => ({
    ...base,
    backgroundColor: '#e6f7ef',
    borderRadius: '0.375rem',
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

  // Immediate values — derived from URL, always in sync
  const categoryParam = searchParams.get('category') ?? '';
  const sort = searchParams.get('sort') ?? 'newest';

  // URL values for debounced fields
  const urlSearch = searchParams.get('search') ?? '';
  const urlBudgetMin = searchParams.get('budget_min') ?? '';
  const urlBudgetMax = searchParams.get('budget_max') ?? '';

  // Local state for debounced inputs — "adjust state on re-render" pattern
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
    <div className="bg-white border border-border rounded-xl p-5 space-y-4">
      <p className="text-sm font-semibold text-ink">Filters</p>

      <Input
        label="Search"
        placeholder="e.g. Tax filing, Bookkeeping..."
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
      />

      <div className="flex flex-col gap-1">
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

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Min ($)"
          type="number"
          placeholder="0"
          value={budgetMin}
          min={0}
          onChange={(e) => handleBudgetChange('budget_min', e.target.value)}
        />
        <Input
          label="Max ($)"
          type="number"
          placeholder="Any"
          value={budgetMax}
          min={0}
          onChange={(e) => handleBudgetChange('budget_max', e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
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
        <Button variant="ghost" size="sm" className="w-full" onClick={() => router.push('/jobs')}>
          Clear all filters
        </Button>
      )}
    </div>
  );
}
