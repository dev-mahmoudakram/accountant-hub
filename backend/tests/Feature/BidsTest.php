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
        'estimated_delivery_time' => '1 week',
        'cover_letter' => 'I have extensive experience in this area and I am confident I can deliver excellent results for your project.',
        'experience_summary' => 'Five years of experience as a certified public accountant specializing in this domain.',
    ];

    // -------------------------------------------------------------------------
    // Submit bid
    // -------------------------------------------------------------------------

    public function test_authenticated_user_can_submit_bid(): void
    {
        $user = User::factory()->create();
        $job = Job::factory()->create([
            'status' => JobStatus::Open,
            'budget_min' => 500,
            'budget_max' => 5000,
        ]);

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
        $job = Job::factory()->create([
            'status' => JobStatus::Closed,
            'budget_min' => 500,
            'budget_max' => 5000,
        ]);

        Sanctum::actingAs($user, ['accountant']);

        $this->postJson("/api/jobs/{$job->id}/bids", $this->validBid)
            ->assertStatus(409)
            ->assertJsonPath('success', false);
    }

    public function test_user_cannot_bid_past_application_deadline(): void
    {
        $user = User::factory()->create();
        $job = Job::factory()->create([
            'status' => JobStatus::Open,
            'deadline' => now()->subDay()->toDateString(),
            'budget_min' => 500,
            'budget_max' => 5000,
        ]);

        Sanctum::actingAs($user, ['accountant']);

        $this->postJson("/api/jobs/{$job->id}/bids", $this->validBid)
            ->assertStatus(409)
            ->assertJsonPath('success', false);
    }

    public function test_user_cannot_submit_duplicate_bid(): void
    {
        $user = User::factory()->create();
        $job = Job::factory()->create([
            'status' => JobStatus::Open,
            'budget_min' => 500,
            'budget_max' => 5000,
        ]);

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

    public function test_submit_bid_rejects_price_below_job_budget_min(): void
    {
        $user = User::factory()->create();
        $job = Job::factory()->create([
            'status' => JobStatus::Open,
            'budget_min' => 1000,
            'budget_max' => 2000,
        ]);

        Sanctum::actingAs($user, ['accountant']);

        $this->postJson("/api/jobs/{$job->id}/bids", array_merge($this->validBid, [
                'proposed_price' => 500,
            ]))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['proposed_price']);
    }

    public function test_submit_bid_rejects_price_above_job_budget_max(): void
    {
        $user = User::factory()->create();
        $job = Job::factory()->create([
            'status' => JobStatus::Open,
            'budget_min' => 1000,
            'budget_max' => 2000,
        ]);

        Sanctum::actingAs($user, ['accountant']);

        $this->postJson("/api/jobs/{$job->id}/bids", array_merge($this->validBid, [
                'proposed_price' => 5000,
            ]))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['proposed_price']);
    }

    public function test_submit_bid_rejects_delivery_longer_than_job_expected(): void
    {
        $user = User::factory()->create();
        $job = Job::factory()->create([
            'status' => JobStatus::Open,
            'budget_min' => 500,
            'budget_max' => 5000,
            'expected_delivery_time' => '2 weeks',
        ]);

        Sanctum::actingAs($user, ['accountant']);

        $this->postJson("/api/jobs/{$job->id}/bids", array_merge($this->validBid, [
                'estimated_delivery_time' => '1 month',
            ]))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['estimated_delivery_time']);
    }

    public function test_submit_bid_rejects_unknown_delivery_duration(): void
    {
        $user = User::factory()->create();
        $job = Job::factory()->create([
            'status' => JobStatus::Open,
            'budget_min' => 500,
            'budget_max' => 5000,
            'expected_delivery_time' => '3 months',
        ]);

        Sanctum::actingAs($user, ['accountant']);

        $this->postJson("/api/jobs/{$job->id}/bids", array_merge($this->validBid, [
                'estimated_delivery_time' => '4 hours',
            ]))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['estimated_delivery_time']);
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

    // -------------------------------------------------------------------------
    // My-bids stats
    // -------------------------------------------------------------------------

    public function test_my_bids_stats_returns_counts_by_status(): void
    {
        $user = User::factory()->create();

        Bid::factory()->count(3)->create(['user_id' => $user->id, 'status' => \App\Enums\BidStatus::Pending]);
        Bid::factory()->count(1)->create(['user_id' => $user->id, 'status' => \App\Enums\BidStatus::Accepted]);
        Bid::factory()->count(2)->create(['user_id' => $user->id, 'status' => \App\Enums\BidStatus::Rejected]);

        Sanctum::actingAs($user, ['accountant']);

        $this->getJson('/api/my-bids/stats')
            ->assertOk()
            ->assertJsonPath('data.total', 6)
            ->assertJsonPath('data.pending', 3)
            ->assertJsonPath('data.accepted', 1)
            ->assertJsonPath('data.rejected', 2);
    }

    public function test_my_bids_filtered_by_status(): void
    {
        $user = User::factory()->create();
        Bid::factory()->count(2)->create(['user_id' => $user->id, 'status' => \App\Enums\BidStatus::Pending]);
        Bid::factory()->count(1)->create(['user_id' => $user->id, 'status' => \App\Enums\BidStatus::Accepted]);

        Sanctum::actingAs($user, ['accountant']);

        $this->getJson('/api/my-bids?status=accepted')
            ->assertOk()
            ->assertJsonPath('meta.total', 1);
    }

    // -------------------------------------------------------------------------
    // Update / withdraw pending bid
    // -------------------------------------------------------------------------

    public function test_user_can_withdraw_their_pending_bid(): void
    {
        $user = User::factory()->create();
        $bid = Bid::factory()->create([
            'user_id' => $user->id,
            'status' => \App\Enums\BidStatus::Pending,
        ]);

        Sanctum::actingAs($user, ['accountant']);

        $this->deleteJson("/api/my-bids/{$bid->id}")
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('bids', ['id' => $bid->id]);
    }

    public function test_user_cannot_withdraw_someone_elses_bid(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $bid = Bid::factory()->create(['user_id' => $owner->id]);

        Sanctum::actingAs($other, ['accountant']);

        $this->deleteJson("/api/my-bids/{$bid->id}")
            ->assertForbidden();

        $this->assertDatabaseHas('bids', ['id' => $bid->id]);
    }

    public function test_user_cannot_withdraw_accepted_or_rejected_bid(): void
    {
        $user = User::factory()->create();
        $accepted = Bid::factory()->create(['user_id' => $user->id, 'status' => \App\Enums\BidStatus::Accepted]);
        $rejected = Bid::factory()->create(['user_id' => $user->id, 'status' => \App\Enums\BidStatus::Rejected]);

        Sanctum::actingAs($user, ['accountant']);

        $this->deleteJson("/api/my-bids/{$accepted->id}")->assertForbidden();
        $this->deleteJson("/api/my-bids/{$rejected->id}")->assertForbidden();

        $this->assertDatabaseHas('bids', ['id' => $accepted->id]);
        $this->assertDatabaseHas('bids', ['id' => $rejected->id]);
    }

    public function test_user_can_update_their_pending_bid(): void
    {
        $user = User::factory()->create();
        $job = Job::factory()->create(['budget_min' => 500, 'budget_max' => 5000, 'expected_delivery_time' => '3 months']);
        $bid = Bid::factory()->create([
            'user_id' => $user->id,
            'job_id' => $job->id,
            'status' => \App\Enums\BidStatus::Pending,
            'proposed_price' => 1000,
        ]);

        Sanctum::actingAs($user, ['accountant']);

        $this->patchJson("/api/my-bids/{$bid->id}", ['proposed_price' => 2000])
            ->assertOk()
            ->assertJsonPath('data.proposed_price', 2000);

        $this->assertDatabaseHas('bids', [
            'id' => $bid->id,
            'proposed_price' => 2000,
        ]);
    }

    public function test_user_cannot_update_accepted_bid(): void
    {
        $user = User::factory()->create();
        $job = Job::factory()->create(['budget_min' => 500, 'budget_max' => 5000]);
        $bid = Bid::factory()->create([
            'user_id' => $user->id,
            'job_id' => $job->id,
            'status' => \App\Enums\BidStatus::Accepted,
        ]);

        Sanctum::actingAs($user, ['accountant']);

        $this->patchJson("/api/my-bids/{$bid->id}", ['proposed_price' => 2000])
            ->assertForbidden();
    }

    public function test_update_bid_validates_price_in_budget_range(): void
    {
        $user = User::factory()->create();
        $job = Job::factory()->create(['budget_min' => 1000, 'budget_max' => 2000]);
        $bid = Bid::factory()->create([
            'user_id' => $user->id,
            'job_id' => $job->id,
            'status' => \App\Enums\BidStatus::Pending,
        ]);

        Sanctum::actingAs($user, ['accountant']);

        $this->patchJson("/api/my-bids/{$bid->id}", ['proposed_price' => 5000])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['proposed_price']);
    }
}
