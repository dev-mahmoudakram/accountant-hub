<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobListResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'company_name' => $this->company_name,
            'short_description' => $this->short_description,
            'budget_min' => (float) $this->budget_min,
            'budget_max' => (float) $this->budget_max,
            'deadline' => $this->deadline?->toDateString(),
            'expected_delivery_time' => $this->expected_delivery_time,
            'status' => $this->status->value,
            'bids_count' => $this->bids_count ?? 0,
            'category' => new JobCategoryResource($this->whenLoaded('category')),
            'poster' => $this->whenLoaded('poster', fn () => [
                'id' => $this->poster->id,
                'name' => $this->poster->name,
            ]),
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
