<?php

namespace App\Actions\Bids;

use App\Enums\BidStatus;
use App\Enums\JobStatus;
use App\Models\Bid;
use App\Models\Job;

class UpdateBidStatusAction
{
    public function execute(Bid $bid, BidStatus $status): Bid
    {
        $bid->update(['status' => $status]);

        // Auto-close the job when a bid is accepted
        if ($status === BidStatus::Accepted) {
            Job::where('id', $bid->job_id)->update(['status' => JobStatus::Closed]);
        }

        return $bid->refresh();
    }
}
