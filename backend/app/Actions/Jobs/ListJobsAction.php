<?php

namespace App\Actions\Jobs;

use App\Http\Requests\JobIndexRequest;
use App\Queries\JobQuery;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ListJobsAction
{
    public function __construct(private readonly JobQuery $query) {}

    public function execute(JobIndexRequest $request): LengthAwarePaginator
    {
        return $this->query->get($request);
    }
}
