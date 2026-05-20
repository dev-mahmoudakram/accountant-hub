<?php

namespace App\Console\Commands;

use App\Models\Job;
use Illuminate\Console\Command;

class CloseExpiredJobs extends Command
{
    protected $signature = 'jobs:close-expired';
    protected $description = 'Close all open jobs whose application deadline has passed';

    public function handle(): void
    {
        $count = Job::closeExpired();

        $this->info("Closed {$count} expired job(s).");
    }
}
