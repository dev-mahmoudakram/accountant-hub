<?php

namespace App\Services;

use App\Enums\JobStatus;
use App\Models\Bid;
use App\Models\Job;
use App\Models\User;

class BidEligibilityService
{
    public function check(User $user, Job $job): ?string
    {
        if ($job->status === JobStatus::Closed) {
            return 'This job is closed and no longer accepting bids.';
        }

        if ($job->user_id === $user->id) {
            return 'You cannot bid on your own job.';
        }

        if (Bid::where('user_id', $user->id)->where('job_id', $job->id)->exists()) {
            return 'You have already submitted a bid for this job.';
        }

        return null;
    }
}
