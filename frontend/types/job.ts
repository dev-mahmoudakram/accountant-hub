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
  category: JobCategory;
  poster?: JobPoster;
  created_at: string;
}

export interface JobDetail extends JobListItem {
  description: string;
  required_skills: string[];
  attachments: { path: string; url: string; name: string }[];
  user_has_bid?: boolean;
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
