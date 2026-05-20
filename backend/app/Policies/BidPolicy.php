<?php

namespace App\Policies;

use App\Enums\BidStatus;
use App\Models\Bid;
use App\Models\User;

class BidPolicy
{
    /**
     * The accountant who submitted this bid can modify it while it's pending.
     * Once accepted or rejected by the client, the bid is locked.
     */
    public function modify(User $user, Bid $bid): bool
    {
        return $bid->user_id === $user->id && $bid->status === BidStatus::Pending;
    }
}
