<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'company_name' => $this->company_name,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'budget_min' => (float) $this->budget_min,
            'budget_max' => (float) $this->budget_max,
            'deadline' => $this->deadline?->toDateString(),
            'expected_delivery_time' => $this->expected_delivery_time,
            'required_skills' => $this->required_skills ?? [],
            'attachments' => collect($this->attachments ?? [])->map(fn (string $path) => [
                'path' => $path,
                'name' => basename($path),
                'url'  => asset('storage/' . $path),
            ])->values()->all(),
            'status' => $this->status->value,
            'bids_count' => $this->bids_count ?? 0,
            'user_has_bid' => $this->when(
                auth('sanctum')->check(),
                fn () => $this->bids->contains('user_id', auth('sanctum')->id())
            ),
            'category' => new JobCategoryResource($this->whenLoaded('category')),
            'poster' => $this->whenLoaded('poster', fn () => [
                'id' => $this->poster->id,
                'name' => $this->poster->name,
            ]),
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
