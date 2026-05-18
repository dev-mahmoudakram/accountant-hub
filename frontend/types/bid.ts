import { JobListItem } from './job';

export type BidStatus = 'pending' | 'accepted' | 'rejected';

export interface Bid {
  id: number;
  proposed_price: number;
  estimated_delivery_time: string;
  cover_letter: string;
  experience_summary: string;
  status: BidStatus;
  job: JobListItem;
  created_at: string;
}

export interface SubmitBidPayload {
  proposed_price: number;
  estimated_delivery_time: string;
  cover_letter: string;
  experience_summary: string;
}
