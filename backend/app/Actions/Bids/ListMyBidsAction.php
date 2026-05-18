<?php

namespace App\Actions\Bids;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ListMyBidsAction
{
    public function execute(User $user, int $perPage = 12): LengthAwarePaginator
    {
        return $user->bids()
            ->with(['job.category'])
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }
}
