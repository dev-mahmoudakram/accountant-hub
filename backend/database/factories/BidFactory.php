<?php

namespace Database\Factories;

use App\Enums\BidStatus;
use App\Models\Job;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class BidFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'job_id' => Job::factory(),
            'proposed_price' => fake()->randomFloat(2, 400, 8000),
            'estimated_delivery_time' => fake()->randomElement([
                '1 week', '2 weeks', '3 weeks', '1 month', '6 weeks',
            ]),
            'cover_letter' => implode("\n\n", fake()->paragraphs(2)),
            'experience_summary' => fake()->paragraph(4),
            'status' => BidStatus::Pending,
        ];
    }
}
