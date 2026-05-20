<?php

namespace App\Actions\Bids;

use App\Http\Requests\UpdateMyBidRequest;
use App\Models\Bid;

class UpdateMyBidAction
{
    public function execute(UpdateMyBidRequest $request, Bid $bid): Bid
    {
        $bid->update($request->only([
            'proposed_price',
            'estimated_delivery_time',
            'cover_letter',
            'experience_summary',
        ]));

        return $bid->fresh(['job.category']);
    }
}
