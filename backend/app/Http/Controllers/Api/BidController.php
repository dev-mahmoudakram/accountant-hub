<?php

namespace App\Http\Controllers\Api;

use App\Actions\Bids\SubmitBidAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\SubmitBidRequest;
use App\Http\Resources\BidResource;
use App\Models\Job;
use Illuminate\Http\JsonResponse;

class BidController extends Controller
{
    public function store(SubmitBidRequest $request, Job $job, SubmitBidAction $action): JsonResponse
    {
        $bid = $action->execute($request->user(), $job, $request);

        return response()->json([
            'success' => true,
            'message' => 'Bid submitted successfully.',
            'data' => new BidResource($bid),
        ], 201);
    }
}
