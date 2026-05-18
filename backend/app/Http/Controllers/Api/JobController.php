<?php

namespace App\Http\Controllers\Api;

use App\Actions\Jobs\ListJobsAction;
use App\Actions\Jobs\ShowJobAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\JobIndexRequest;
use App\Http\Resources\JobDetailResource;
use App\Http\Resources\JobListResource;
use App\Models\Job;
use Illuminate\Http\JsonResponse;

class JobController extends Controller
{
    public function index(JobIndexRequest $request, ListJobsAction $action): JsonResponse
    {
        $paginator = $action->execute($request);

        return response()->json([
            'success' => true,
            'data' => JobListResource::collection($paginator),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }

    public function show(Job $job, ShowJobAction $action): JsonResponse
    {
        $job = $action->execute($job);

        return response()->json([
            'success' => true,
            'data' => new JobDetailResource($job),
        ]);
    }
}
