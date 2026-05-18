<?php

namespace App\Actions\Bids;

use App\Enums\BidStatus;
use App\Http\Requests\SubmitBidRequest;
use App\Models\Bid;
use App\Models\Job;
use App\Models\User;
use App\Services\BidEligibilityService;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\Exceptions\HttpResponseException;

class SubmitBidAction
{
    public function __construct(private readonly BidEligibilityService $eligibility) {}

    public function execute(User $user, Job $job, SubmitBidRequest $request): Bid
    {
        if ($error = $this->eligibility->check($user, $job)) {
            throw new HttpResponseException(response()->json([
                'success' => false,
                'message' => $error,
            ], 409));
        }

        try {
            return Bid::create([
                'user_id' => $user->id,
                'job_id' => $job->id,
                'proposed_price' => $request->validated('proposed_price'),
                'estimated_delivery_time' => $request->validated('estimated_delivery_time'),
                'cover_letter' => $request->validated('cover_letter'),
                'experience_summary' => $request->validated('experience_summary'),
                'status' => BidStatus::Pending,
            ]);
        } catch (UniqueConstraintViolationException) {
            // Race condition: another request slipped through between the check and insert
            throw new HttpResponseException(response()->json([
                'success' => false,
                'message' => 'You have already submitted a bid for this job.',
            ], 409));
        }
    }
}
