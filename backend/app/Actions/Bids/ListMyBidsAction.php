<?php

namespace App\Actions\Bids;

use App\Enums\BidStatus;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ListMyBidsAction
{
    public function execute(User $user, ?string $status, int $perPage = 12): LengthAwarePaginator
    {
        $query = $user->bids()
            ->with(['job.category'])
            ->orderByDesc('created_at');

        if ($status !== null && $status !== 'all') {
            $query->where('status', BidStatus::from($status));
        }

        return $query->paginate($perPage);
    }
}
