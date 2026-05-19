<?php

namespace App\Console\Commands;

use App\Enums\JobStatus;
use App\Models\Job;
use Illuminate\Console\Command;

class CloseExpiredJobs extends Command
{
    protected $signature = 'jobs:close-expired';
    protected $description = 'Close all open jobs whose application deadline has passed';

    public function handle(): void
    {
        $count = Job::where('status', JobStatus::Open)
            ->whereDate('deadline', '<', today())
            ->update(['status' => JobStatus::Closed]);

        $this->info("Closed {$count} expired job(s).");
    }
}
