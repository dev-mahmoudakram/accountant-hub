'use client';

import { useEffect, useRef, useState } from 'react';
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
  years: number[];
}

const SORT_OPTIONS: Option[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'highest_budget', label: 'Highest budget' },
];

const STATUS_OPTIONS: Option[] = [
  { value: 'open', label: 'Open jobs only' },
  { value: 'closed', label: 'Closed jobs only' },
  { value: 'all', label: 'All jobs' },
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

const dateSelectStyles: StylesConfig<Option, false> = {
  ...sharedControlStyles,
  control: (base, { isFocused }) => ({
    ...base,
    minHeight: '36px',
    borderRadius: '0.5rem',
    borderColor: isFocused ? '#019a51' : '#e5e7eb',
    boxShadow: isFocused ? '0 0 0 3px rgba(1,154,81,0.15)' : 'none',
    backgroundColor: '#fff',
    fontSize: '0.8125rem',
    transition: 'border-color 150ms, box-shadow 150ms',
    cursor: 'pointer',
    '&:hover': { borderColor: isFocused ? '#019a51' : '#d1d5db' },
  }),
  placeholder: (base) => ({ ...base, color: '#9ca3af', fontSize: '0.8125rem' }),
  singleValue: (base) => ({ ...base, color: '#0a0a0a', fontSize: '0.8125rem' }),
  input: (base) => ({ ...base, color: '#0a0a0a', fontSize: '0.8125rem', margin: 0, padding: 0 }),
  valueContainer: (base) => ({ ...base, padding: '0 10px' }),
  dropdownIndicator: (base) => ({ ...base, color: '#9ca3af', padding: '0 6px', '&:hover': { color: '#6b7280' } }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

export default function JobFiltersPanel({ categories, years }: JobFiltersPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const budgetMinDebounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const budgetMaxDebounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const categoryParam = searchParams.get('category') ?? '';
  const sort = searchParams.get('sort') ?? 'newest';
  const status = searchParams.get('status') ?? 'open';
  const urlSearch = searchParams.get('search') ?? '';
  const urlBudgetMin = searchParams.get('budget_min') ?? '';
  const urlBudgetMax = searchParams.get('budget_max') ?? '';
  const urlDateFrom = searchParams.get('date_from') ?? '';
  const urlDateTo = searchParams.get('date_to') ?? '';

  const [search, setSearch] = useState(urlSearch);
  const [budgetMin, setBudgetMin] = useState(urlBudgetMin);
  const [budgetMax, setBudgetMax] = useState(urlBudgetMax);
  const [fromMonth, setFromMonth] = useState(() => urlDateFrom.split('-')[1] ?? '');
  const [fromYear,  setFromYear]  = useState(() => urlDateFrom.split('-')[0] ?? '');
  const [toMonth,   setToMonth]   = useState(() => urlDateTo.split('-')[1] ?? '');
  const [toYear,    setToYear]    = useState(() => urlDateTo.split('-')[0] ?? '');

  // Sync local state when the URL changes externally (e.g. "Clear all", back/forward).
  useEffect(() => { setSearch(urlSearch); }, [urlSearch]);
  useEffect(() => { setBudgetMin(urlBudgetMin); }, [urlBudgetMin]);
  useEffect(() => { setBudgetMax(urlBudgetMax); }, [urlBudgetMax]);
  useEffect(() => {
    setFromMonth(urlDateFrom.split('-')[1] ?? '');
    setFromYear(urlDateFrom.split('-')[0] ?? '');
  }, [urlDateFrom]);
  useEffect(() => {
    setToMonth(urlDateTo.split('-')[1] ?? '');
    setToYear(urlDateTo.split('-')[0] ?? '');
  }, [urlDateTo]);

  function pushParam(key: string, value: string) {
    const base = new URLSearchParams(window.location.search);
    base.delete('page');
    const isDefault =
      (key === 'sort' && value === 'newest') ||
      (key === 'status' && value === 'open');
    if (value && !isDefault) {
      base.set(key, value);
    } else {
      base.delete(key);
    }
    router.push(`/jobs${base.toString() ? `?${base.toString()}` : ''}`);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => pushParam('search', value), 400);
  }

  function handleBudgetChange(key: 'budget_min' | 'budget_max', value: string) {
    const ref = key === 'budget_min' ? budgetMinDebounceRef : budgetMaxDebounceRef;
    if (key === 'budget_min') setBudgetMin(value);
    else setBudgetMax(value);
    clearTimeout(ref.current);
    ref.current = setTimeout(() => pushParam(key, value), 600);
  }

  function handleCategoryChange(selected: MultiValue<Option>) {
    const value = selected.map((o) => o.value).join(',');
    pushParam('category', value);
  }

  const categoryOptions: Option[] = categories.map((c) => ({ value: c.slug, label: c.name }));
  const selectedSlugs = categoryParam ? categoryParam.split(',').filter(Boolean) : [];
  const categoryValue = categoryOptions.filter((o) => selectedSlugs.includes(o.value));
  const sortValue = SORT_OPTIONS.find((o) => o.value === sort) ?? SORT_OPTIONS[0];
  const statusValue = STATUS_OPTIONS.find((o) => o.value === status) ?? STATUS_OPTIONS[0];
  const hasFilters = !!(urlSearch || categoryParam || urlBudgetMin || urlBudgetMax || urlDateFrom || urlDateTo || sort !== 'newest' || status !== 'open');

  const MONTHS = [
    { value: '01', label: 'January' }, { value: '02', label: 'February' },
    { value: '03', label: 'March' },   { value: '04', label: 'April' },
    { value: '05', label: 'May' },     { value: '06', label: 'June' },
    { value: '07', label: 'July' },    { value: '08', label: 'August' },
    { value: '09', label: 'September' },{ value: '10', label: 'October' },
    { value: '11', label: 'November' },{ value: '12', label: 'December' },
  ];
  const YEARS = years;

  function isFromAfterTo(fYear: string, fMonth: string, tYear: string, tMonth: string): boolean {
    if (!fYear || !fMonth || !tYear || !tMonth) return false;
    return parseInt(fYear) * 100 + parseInt(fMonth) > parseInt(tYear) * 100 + parseInt(tMonth);
  }

  function handleDateChange(type: 'date_from' | 'date_to', field: 'year' | 'month', value: string) {
    const isFrom = type === 'date_from';
    const month = field === 'month' ? value : (isFrom ? fromMonth : toMonth);
    const year  = field === 'year'  ? value : (isFrom ? fromYear  : toYear);

    if (isFrom) { field === 'month' ? setFromMonth(value) : setFromYear(value); }
    else        { field === 'month' ? setToMonth(value)   : setToYear(value);   }

    const newFromYear  = isFrom ? year  : fromYear;
    const newFromMonth = isFrom ? month : fromMonth;
    const newToYear    = isFrom ? toYear  : year;
    const newToMonth   = isFrom ? toMonth : month;

    // Don't push to URL if From is after To
    if (isFromAfterTo(newFromYear, newFromMonth, newToYear, newToMonth)) return;

    if (month && year) pushParam(type, `${year}-${month}`);
    else if (!month && !year) pushParam(type, '');
  }

  const dateRangeError = isFromAfterTo(fromYear, fromMonth, toYear, toMonth)
    ? '"From" date cannot be after "To" date'
    : null;

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

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-ink">Posted date</label>
          {(['from', 'to'] as const).map((type) => {
            const key = type === 'from' ? 'date_from' : 'date_to';
            const month = type === 'from' ? fromMonth : toMonth;
            const year  = type === 'from' ? fromYear  : toYear;
            const monthValue = MONTHS.find((m) => m.value === month) ?? null;
            const yearOptions = YEARS.map((y) => ({ value: String(y), label: String(y) }));
            const yearValue = yearOptions.find((y) => y.value === year) ?? null;
            const hasError = dateRangeError !== null;
            return (
              <div key={type} className="flex items-center gap-2">
                <span className={`text-xs font-medium w-7 shrink-0 ${hasError ? 'text-red-500' : 'text-muted'}`}>
                  {type === 'from' ? 'From' : 'To'}
                </span>
                <div className="flex-1">
                  <ReactSelect<Option, false>
                    options={MONTHS}
                    value={monthValue}
                    onChange={(opt) => handleDateChange(key, 'month', opt?.value ?? '')}
                    placeholder="Month"
                    isSearchable={false}
                    isClearable={false}
                    menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                    menuPosition="fixed"
                    styles={hasError ? {
                      ...dateSelectStyles,
                      control: (base, state) => ({ ...(dateSelectStyles.control as Function)(base, state), borderColor: '#ef4444' }),
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    } : dateSelectStyles}
                    instanceId={`${type}-month`}
                  />
                </div>
                <div className="w-24 shrink-0">
                  <ReactSelect<Option, false>
                    options={yearOptions}
                    value={yearValue}
                    onChange={(opt) => handleDateChange(key, 'year', opt?.value ?? '')}
                    placeholder="Year"
                    isSearchable={false}
                    isClearable={false}
                    menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                    menuPosition="fixed"
                    styles={hasError ? {
                      ...dateSelectStyles,
                      control: (base, state) => ({ ...(dateSelectStyles.control as Function)(base, state), borderColor: '#ef4444' }),
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    } : dateSelectStyles}
                    instanceId={`${type}-year`}
                  />
                </div>
              </div>
            );
          })}
          {dateRangeError && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              "From" must be before "To"
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-ink">Status</label>
          <ReactSelect<Option, false>
            options={STATUS_OPTIONS}
            value={statusValue}
            onChange={(option) => pushParam('status', option?.value ?? 'open')}
            isSearchable={false}
            styles={sortSelectStyles}
            instanceId="status-select"
          />
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
