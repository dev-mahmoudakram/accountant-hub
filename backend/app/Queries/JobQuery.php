<?php

namespace App\Queries;

use App\Http\Requests\JobIndexRequest;
use App\Models\Job;
use App\Models\JobCategory;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class JobQuery
{
    public function get(JobIndexRequest $request): LengthAwarePaginator
    {
        $query = Job::query()
            ->with('category')
            ->withCount('bids');

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

        match ($request->validated('sort', 'newest')) {
            'highest_budget' => $query->orderByDesc('budget_max'),
            default => $query->orderByDesc('created_at'),
        };

        $perPage = (int) $request->validated('per_page', 12);

        return $query->paginate($perPage)->withQueryString();
    }
}
