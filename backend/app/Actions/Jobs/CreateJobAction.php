<?php

namespace App\Actions\Jobs;

use App\Enums\JobStatus;
use App\Http\Requests\CreateJobRequest;
use App\Models\Job;
use App\Models\User;

class CreateJobAction
{
    public function execute(CreateJobRequest $request, User $client): Job
    {
        return $client->jobs()->create([
            'category_id' => $request->category_id,
            'title' => $request->title,
            'company_name' => $request->company_name,
            'short_description' => $request->short_description,
            'description' => $request->description,
            'budget_min' => $request->budget_min,
            'budget_max' => $request->budget_max,
            'deadline' => $request->deadline,
            'expected_delivery_time' => $request->expected_delivery_time,
            'required_skills' => $request->required_skills,
            'attachments' => null,
            'status' => JobStatus::Open,
        ]);
    }
}
