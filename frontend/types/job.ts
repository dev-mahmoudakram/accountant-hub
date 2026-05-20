export type JobStatus = 'open' | 'closed';

export interface JobCategory {
  id: number;
  name: string;
  slug: string;
}

export interface JobPoster {
  id: number;
  name: string;
}

export interface JobListItem {
  id: number;
  title: string;
  company_name: string;
  short_description: string;
  budget_min: number;
  budget_max: number;
  deadline: string;
  expected_delivery_time: string;
  status: JobStatus;
  bids_count: number;
  /**
   * Only present when the request is authenticated.
   * `null` if the user hasn't bid; otherwise contains the bid's status.
   */
  user_bid?: { status: 'pending' | 'accepted' | 'rejected' } | null;
  category: JobCategory;
  poster?: JobPoster;
  created_at: string;
}

export interface JobDetail extends JobListItem {
  description: string;
  required_skills: string[];
  attachments: { path: string; url: string; name: string }[];
  /**
   * Only present when the request is authenticated.
   * `null` means the user has not bid on this job; otherwise contains the bid's details.
   */
  user_bid?: UserBidSummary | null;
}

export interface UserBidSummary {
  id: number;
  status: 'pending' | 'accepted' | 'rejected';
  proposed_price: number;
  estimated_delivery_time: string;
  created_at: string;
}

export interface JobFilters {
  search?: string;
  category?: string;
  budget_min?: string;
  budget_max?: string;
  sort?: 'newest' | 'highest_budget';
  page?: number;
  per_page?: number;
}

export interface JobFormData {
  category_id: number;
  title: string;
  company_name: string;
  short_description: string;
  description: string;
  budget_min: number;
  budget_max: number;
  deadline: string;
  expected_delivery_time: string;
  required_skills: string[];
}
