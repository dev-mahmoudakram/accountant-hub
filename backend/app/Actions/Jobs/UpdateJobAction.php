<?php

namespace App\Actions\Jobs;

use App\Http\Requests\UpdateJobRequest;
use App\Models\Job;

class UpdateJobAction
{
    public function execute(UpdateJobRequest $request, Job $job): Job
    {
        $job->update($request->only([
            'category_id',
            'title',
            'company_name',
            'short_description',
            'description',
            'budget_min',
            'budget_max',
            'deadline',
            'expected_delivery_time',
            'required_skills',
        ]));

        return $job->fresh(['category']);
    }
}
