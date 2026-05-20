<?php

namespace App\Queries;

use App\Enums\JobStatus;
use App\Http\Requests\JobIndexRequest;
use App\Models\Bid;
use App\Models\Job;
use App\Models\JobCategory;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;

class JobQuery
{
    public function get(JobIndexRequest $request): LengthAwarePaginator
    {
        // Lazy-close any jobs whose deadline has passed so the listing
        // reflects fresh status even on hosts without cron.
        Job::closeExpired();

        $query = Job::query()
            ->with(['category', 'poster'])
            ->withCount('bids');

        // For authed users, pull each row's bid status (if any) in a single
        // subquery — avoids N+1 lookups in JobListResource.
        if ($userId = auth('sanctum')->id()) {
            $query->addSelect([
                'user_bid_status' => Bid::select('status')
                    ->whereColumn('job_id', 'jobs.id')
                    ->where('user_id', $userId)
                    ->limit(1),
            ]);
        }

        // Status filter — default to open jobs only; pass status=all to include closed.
        $status = $request->validated('status', 'open');
        if ($status === 'open') {
            $query->where('status', JobStatus::Open);
        } elseif ($status === 'closed') {
            $query->where('status', JobStatus::Closed);
        }

        if ($search = $request->validated('search')) {
            $query->where('title', 'like', '%'.$search.'%');
        }

        if ($categorySlugs = $request->validated('category')) {
            $slugs = array_filter(array_map('trim', explode(',', $categorySlugs)));
            $categoryIds = JobCategory::whereIn('slug', $slugs)->pluck('id');
            $query->whereIn('category_id', $categoryIds);
        }

        if ($budgetMin = $request->validated('budget_min')) {
            $query->where('budget_max', '>=', $budgetMin);
        }

        if ($budgetMax = $request->validated('budget_max')) {
            $query->where('budget_min', '<=', $budgetMax);
        }

        if ($dateFrom = $request->validated('date_from')) {
            $query->whereDate('created_at', '>=', Carbon::createFromFormat('Y-m', $dateFrom)->startOfMonth());
        }

        if ($dateTo = $request->validated('date_to')) {
            $query->whereDate('created_at', '<=', Carbon::createFromFormat('Y-m', $dateTo)->endOfMonth());
        }

        match ($request->validated('sort', 'newest')) {
            'highest_budget' => $query->orderByDesc('budget_max'),
            'lowest_budget' => $query->orderBy('budget_min'),
            default => $query->orderByDesc('created_at'),
        };

        $perPage = (int) $request->validated('per_page', 12);

        return $query->paginate($perPage)->withQueryString();
    }
}
