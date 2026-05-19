<?php

namespace App\Http\Controllers\Api\Client;

use App\Actions\Jobs\CreateJobAction;
use App\Actions\Jobs\UpdateJobAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\CreateJobRequest;
use App\Http\Requests\UpdateJobRequest;
use App\Http\Resources\JobDetailResource;
use App\Http\Resources\JobListResource;
use App\Models\Job;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ClientJobController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $jobs = $request->user()
            ->jobs()
            ->with('category')
            ->withCount('bids')
            ->latest()
            ->paginate(10);

        return JobListResource::collection($jobs);
    }

    public function store(CreateJobRequest $request, CreateJobAction $action): JsonResponse
    {
        $job = $action->execute($request, $request->user());
        $job->load('category')->loadCount('bids');

        return response()->json([
            'success' => true,
            'message' => 'Job posted successfully.',
            'data' => new JobDetailResource($job),
        ], 201);
    }

    public function show(Request $request, Job $job): JsonResponse
    {
        $this->authorize('manage', $job);

        $job->load(['category', 'bids'])->loadCount('bids');

        return response()->json([
            'success' => true,
            'data' => new JobDetailResource($job),
        ]);
    }

    public function update(UpdateJobRequest $request, Job $job, UpdateJobAction $action): JsonResponse
    {
        $this->authorize('manage', $job);

        $job = $action->execute($request, $job);
        $job->loadCount('bids');

        return response()->json([
            'success' => true,
            'message' => 'Job updated successfully.',
            'data' => new JobDetailResource($job),
        ]);
    }

    public function destroy(Request $request, Job $job): JsonResponse
    {
        $this->authorize('manage', $job);

        $job->delete();

        return response()->json([
            'success' => true,
            'message' => 'Job deleted successfully.',
        ]);
    }
}
