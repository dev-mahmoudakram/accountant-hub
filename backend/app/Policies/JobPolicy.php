<?php

namespace App\Policies;

use App\Enums\JobStatus;
use App\Models\Job;
use App\Models\User;

class JobPolicy
{
    public function manage(User $user, Job $job): bool
    {
        return $job->user_id !== null && $user->id === $job->user_id;
    }

    public function update(User $user, Job $job): bool
    {
        return $this->manage($user, $job) && $job->status !== JobStatus::Closed;
    }
}
