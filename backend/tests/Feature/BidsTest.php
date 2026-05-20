<?php

namespace Tests\Feature;

use App\Enums\JobStatus;
use App\Models\Bid;
use App\Models\Job;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class BidsTest extends TestCase
{
    use RefreshDatabase;

    private array $validBid = [
        'proposed_price' => 1500,
        'estimated_delivery_time' => '2 weeks',
        'cover_letter' => 'I have extensive experience in this area and I am confident I can deliver excellent results for your project.',
        'experience_summary' => 'Five years of experience as a certified public accountant specializing in this domain.',
    ];

    // -------------------------------------------------------------------------
    // Submit bid
    // -------------------------------------------------------------------------

    public function test_authenticated_user_can_submit_bid(): void
    {
        $user = User::factory()->create();
        $job = Job::factory()->create(['status' => JobStatus::Open]);

        Sanctum::actingAs($user, ['accountant']);

        $this->postJson("/api/jobs/{$job->id}/bids", $this->validBid)
            ->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Bid submitted successfully.')
            ->assertJsonStructure(['data' => ['id', 'proposed_price', 'status']]);

        $this->assertDatabaseHas('bids', [
            'user_id' => $user->id,
            'job_id' => $job->id,
            'proposed_price' => 1500,
        ]);
    }

    public function test_guest_cannot_submit_bid(): void
    {
        $job = Job::factory()->create(['status' => JobStatus::Open]);

        $this->postJson("/api/jobs/{$job->id}/bids", $this->validBid)
            ->assertUnauthorized();
    }

    public function test_user_cannot_bid_on_closed_job(): void
    {
        $user = User::factory()->create();
        $job = Job::factory()->create(['status' => JobStatus::Closed]);

        Sanctum::actingAs($user, ['accountant']);

        $this->postJson("/api/jobs/{$job->id}/bids", $this->validBid)
            ->assertStatus(409)
            ->assertJsonPath('success', false);
    }

    public function test_user_cannot_submit_duplicate_bid(): void
    {
        $user = User::factory()->create();
        $job = Job::factory()->create(['status' => JobStatus::Open]);

        Bid::factory()->create(['user_id' => $user->id, 'job_id' => $job->id]);

        Sanctum::actingAs($user, ['accountant']);

        $this->postJson("/api/jobs/{$job->id}/bids", $this->validBid)
            ->assertStatus(409)
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'You have already submitted a bid for this job.');
    }

    public function test_submit_bid_validates_required_fields(): void
    {
        $user = User::factory()->create();
        $job = Job::factory()->create(['status' => JobStatus::Open]);

        Sanctum::actingAs($user, ['accountant']);

        $this->postJson("/api/jobs/{$job->id}/bids", [])
            ->assertStatus(422)
            ->assertJsonValidationErrors([
                'proposed_price',
                'estimated_delivery_time',
                'cover_letter',
                'experience_summary',
            ]);
    }

    public function test_submit_bid_rejects_non_numeric_price(): void
    {
        $user = User::factory()->create();
        $job = Job::factory()->create(['status' => JobStatus::Open]);

        Sanctum::actingAs($user, ['accountant']);

        $this->postJson("/api/jobs/{$job->id}/bids", array_merge($this->validBid, [
                'proposed_price' => 'not-a-number',
            ]))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['proposed_price']);
    }

    public function test_submit_bid_returns_404_for_missing_job(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user, ['accountant']);

        $this->postJson('/api/jobs/999/bids', $this->validBid)
            ->assertNotFound();
    }

    // -------------------------------------------------------------------------
    // My bids
    // -------------------------------------------------------------------------

    public function test_authenticated_user_can_view_own_bids(): void
    {
        $user = User::factory()->create();
        Bid::factory()->count(3)->create(['user_id' => $user->id]);

        Sanctum::actingAs($user, ['accountant']);

        $this->getJson('/api/my-bids')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('meta.total', 3)
            ->assertJsonCount(3, 'data');
    }

    public function test_my_bids_only_returns_own_bids(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        Bid::factory()->count(4)->create(['user_id' => $userA->id]);
        Bid::factory()->count(2)->create(['user_id' => $userB->id]);

        Sanctum::actingAs($userA, ['accountant']);

        $this->getJson('/api/my-bids')
            ->assertOk()
            ->assertJsonPath('meta.total', 4);
    }

    public function test_my_bids_returns_empty_when_none_submitted(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user, ['accountant']);

        $this->getJson('/api/my-bids')
            ->assertOk()
            ->assertJsonPath('meta.total', 0)
            ->assertJsonCount(0, 'data');
    }

    public function test_guest_cannot_view_my_bids(): void
    {
        $this->getJson('/api/my-bids')->assertUnauthorized();
    }
}
