<?php

namespace App\Http\Controllers\Api\Client;

use App\Actions\Bids\UpdateBidStatusAction;
use App\Enums\BidStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateBidStatusRequest;
use App\Http\Resources\BidResource;
use App\Models\Bid;
use App\Models\Job;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ClientBidController extends Controller
{
    public function index(Job $job): AnonymousResourceCollection
    {
        $this->authorize('manage', $job);

        $bids = $job->bids()
            ->with('user')
            ->latest()
            ->paginate(20);

        return BidResource::collection($bids);
    }

    public function update(
        UpdateBidStatusRequest $request,
        Job $job,
        Bid $bid,
        UpdateBidStatusAction $action,
    ): JsonResponse {
        $this->authorize('manage', $job);

        if ($bid->job_id !== $job->id) {
            return response()->json(['message' => 'Bid not found.'], 404);
        }

        $status = BidStatus::from($request->input('status'));
        $bid = $action->execute($bid, $status);

        $message = $status === BidStatus::Accepted
            ? 'Bid accepted. Job is now closed.'
            : 'Bid rejected.';

        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => new BidResource($bid),
        ]);
    }
}
