import { JobListItem } from './job';
import { User } from './user';

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

export interface BidWithAccountant extends Omit<Bid, 'job'> {
  accountant: Pick<User, 'id' | 'name' | 'email'>;
}

export interface SubmitBidPayload {
  proposed_price: number;
  estimated_delivery_time: string;
  cover_letter: string;
  experience_summary: string;
}

export interface UpdateBidStatusPayload {
  status: 'accepted' | 'rejected';
}
