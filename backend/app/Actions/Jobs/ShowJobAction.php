<?php

namespace App\Actions\Jobs;

use App\Enums\JobStatus;
use App\Models\Job;

class ShowJobAction
{
    public function execute(Job $job): Job
    {
        // Lazy-close this specific job if its deadline has passed,
        // so the detail page shows fresh status even without cron.
        if ($job->status === JobStatus::Open && $job->deadline?->isPast()) {
            $job->update(['status' => JobStatus::Closed]);
        }

        return $job->loadCount('bids')->load('category', 'poster');
    }
}
