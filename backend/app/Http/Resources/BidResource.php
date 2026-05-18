<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BidResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'proposed_price' => (float) $this->proposed_price,
            'estimated_delivery_time' => $this->estimated_delivery_time,
            'cover_letter' => $this->cover_letter,
            'experience_summary' => $this->experience_summary,
            'status' => $this->status->value,
            'job' => new JobListResource($this->whenLoaded('job')),
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
