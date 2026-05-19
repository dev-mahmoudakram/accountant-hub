<?php

namespace App\Actions\Jobs;

use App\Models\Job;

class ShowJobAction
{
    public function execute(Job $job): Job
    {
        return $job->loadCount('bids')->load('category', 'bids', 'poster');
    }
}
