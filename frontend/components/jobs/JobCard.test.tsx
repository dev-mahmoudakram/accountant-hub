import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import JobCard from './JobCard';
import { JobListItem } from '@/types/job';

function baseJob(overrides: Partial<JobListItem> = {}): JobListItem {
  return {
    id: 1,
    title: 'Senior Tax Accountant',
    company_name: 'Acme Corp',
    short_description: 'Looking for an experienced tax accountant.',
    budget_min: 500,
    budget_max: 2000,
    deadline: '2026-12-31',
    expected_delivery_time: '2 weeks',
    status: 'open',
    bids_count: 3,
    category: { id: 1, name: 'Tax Preparation', slug: 'tax-preparation' },
    created_at: '2026-05-01T10:00:00Z',
    ...overrides,
  };
}

describe('<JobCard />', () => {
  it('renders the core job fields', () => {
    render(<JobCard job={baseJob()} />);

    expect(screen.getByText('Senior Tax Accountant')).toBeDefined();
    expect(screen.getByText('Acme Corp')).toBeDefined();
    expect(screen.getByText('Tax Preparation')).toBeDefined();
    expect(screen.getByText('$500 – $2,000')).toBeDefined();
    expect(screen.getByText('Open')).toBeDefined();
  });

  it('shows pluralized bids count', () => {
    render(<JobCard job={baseJob({ bids_count: 3 })} />);
    expect(screen.getByText('3 bids')).toBeDefined();
  });

  it('shows singular bid count for one bid', () => {
    render(<JobCard job={baseJob({ bids_count: 1 })} />);
    expect(screen.getByText('1 bid')).toBeDefined();
  });

  it('does not render the user-bid badge when user_bid is missing', () => {
    render(<JobCard job={baseJob()} />);
    expect(screen.queryByText('Applied')).toBeNull();
    expect(screen.queryByText('Won')).toBeNull();
    expect(screen.queryByText('Rejected')).toBeNull();
  });

  it('shows the "Applied" badge for a pending user bid', () => {
    render(<JobCard job={baseJob({ user_bid: { status: 'pending' } })} />);
    expect(screen.getByText('Applied')).toBeDefined();
  });

  it('shows the "Won" badge for an accepted user bid', () => {
    render(<JobCard job={baseJob({ user_bid: { status: 'accepted' } })} />);
    expect(screen.getByText('Won')).toBeDefined();
  });

  it('shows the "Rejected" badge for a rejected user bid', () => {
    render(<JobCard job={baseJob({ user_bid: { status: 'rejected' } })} />);
    expect(screen.getByText('Rejected')).toBeDefined();
  });

  it('shows the Closed badge when the job status is closed', () => {
    render(<JobCard job={baseJob({ status: 'closed' })} />);
    expect(screen.getByText('Closed')).toBeDefined();
  });
});
