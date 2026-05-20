<?php

namespace Tests\Feature;

use App\Models\Bid;
use App\Models\Job;
use App\Models\JobCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class JobsTest extends TestCase
{
    use RefreshDatabase;

    // -------------------------------------------------------------------------
    // Categories
    // -------------------------------------------------------------------------

    public function test_categories_can_be_listed(): void
    {
        JobCategory::factory()->count(3)->create();

        $this->getJson('/api/categories')
            ->assertOk()
            ->assertJsonStructure([
                'success',
                'data' => [['id', 'name', 'slug']],
            ])
            ->assertJsonPath('success', true)
            ->assertJsonCount(3, 'data');
    }

    public function test_categories_returns_empty_when_none_exist(): void
    {
        $this->getJson('/api/categories')
            ->assertOk()
            ->assertJsonCount(0, 'data');
    }

    // -------------------------------------------------------------------------
    // Jobs listing
    // -------------------------------------------------------------------------

    public function test_jobs_can_be_listed(): void
    {
        Job::factory()->open()->count(5)->create();

        $response = $this->getJson('/api/jobs');

        $response->assertOk()
            ->assertJsonStructure([
                'success',
                'data' => [[
                    'id', 'title', 'company_name', 'short_description',
                    'budget_min', 'budget_max', 'deadline', 'status',
                    'bids_count', 'category', 'created_at',
                ]],
                'meta' => ['current_page', 'last_page', 'per_page', 'total'],
            ])
            ->assertJsonPath('success', true)
            ->assertJsonPath('meta.total', 5);
    }

    public function test_jobs_listing_returns_empty_state(): void
    {
        $this->getJson('/api/jobs')
            ->assertOk()
            ->assertJsonPath('meta.total', 0)
            ->assertJsonCount(0, 'data');
    }

    public function test_jobs_listing_defaults_to_open_only(): void
    {
        Job::factory()->open()->count(3)->create();
        Job::factory()->closed()->count(2)->create();

        $this->getJson('/api/jobs')
            ->assertOk()
            ->assertJsonPath('meta.total', 3);
    }

    public function test_jobs_listing_can_show_closed_only(): void
    {
        Job::factory()->open()->count(3)->create();
        Job::factory()->closed()->count(2)->create();

        $this->getJson('/api/jobs?status=closed')
            ->assertOk()
            ->assertJsonPath('meta.total', 2);
    }

    public function test_jobs_listing_can_show_all_statuses(): void
    {
        Job::factory()->open()->count(3)->create();
        Job::factory()->closed()->count(2)->create();

        $this->getJson('/api/jobs?status=all')
            ->assertOk()
            ->assertJsonPath('meta.total', 5);
    }

    public function test_jobs_listing_rejects_invalid_status(): void
    {
        $this->getJson('/api/jobs?status=invalid')
            ->assertStatus(422)
            ->assertJsonValidationErrors(['status']);
    }

    public function test_jobs_can_be_searched_by_title(): void
    {
        Job::factory()->open()->create(['title' => 'Senior Tax Accountant']);
        Job::factory()->open()->create(['title' => 'Bookkeeping Services']);

        $this->getJson('/api/jobs?search=Tax')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.title', 'Senior Tax Accountant');
    }

    public function test_jobs_can_be_filtered_by_category_slug(): void
    {
        $tax = JobCategory::factory()->create(['slug' => 'tax-preparation']);
        $bookkeeping = JobCategory::factory()->create(['slug' => 'bookkeeping']);

        Job::factory()->open()->count(2)->create(['category_id' => $tax->id]);
        Job::factory()->open()->count(3)->create(['category_id' => $bookkeeping->id]);

        $this->getJson('/api/jobs?category=tax-preparation')
            ->assertOk()
            ->assertJsonPath('meta.total', 2);
    }

    public function test_jobs_can_be_filtered_by_budget_range(): void
    {
        Job::factory()->open()->create(['budget_min' => 500, 'budget_max' => 1000]);
        Job::factory()->open()->create(['budget_min' => 2000, 'budget_max' => 4000]);
        Job::factory()->open()->create(['budget_min' => 5000, 'budget_max' => 8000]);

        $this->getJson('/api/jobs?budget_min=1500&budget_max=5000')
            ->assertOk()
            ->assertJsonPath('meta.total', 2);
    }

    public function test_jobs_can_be_sorted_by_newest(): void
    {
        Job::factory()->open()->create(['created_at' => now()->subDays(10)]);
        $new = Job::factory()->open()->create(['created_at' => now()]);

        $response = $this->getJson('/api/jobs?sort=newest')->assertOk();

        $this->assertEquals($new->id, $response->json('data.0.id'));
    }

    public function test_jobs_can_be_sorted_by_highest_budget(): void
    {
        Job::factory()->open()->create(['budget_max' => 1000]);
        $highest = Job::factory()->open()->create(['budget_max' => 9000]);

        $response = $this->getJson('/api/jobs?sort=highest_budget')->assertOk();

        $this->assertEquals($highest->id, $response->json('data.0.id'));
    }

    public function test_jobs_listing_is_paginated(): void
    {
        Job::factory()->open()->count(20)->create();

        $this->getJson('/api/jobs?per_page=5')
            ->assertOk()
            ->assertJsonPath('meta.total', 20)
            ->assertJsonPath('meta.per_page', 5)
            ->assertJsonPath('meta.last_page', 4)
            ->assertJsonCount(5, 'data');
    }

    public function test_jobs_listing_rejects_invalid_sort(): void
    {
        $this->getJson('/api/jobs?sort=invalid')
            ->assertStatus(422)
            ->assertJsonValidationErrors(['sort']);
    }

    // -------------------------------------------------------------------------
    // Job details
    // -------------------------------------------------------------------------

    public function test_job_detail_can_be_viewed(): void
    {
        $job = Job::factory()->create();

        $this->getJson("/api/jobs/{$job->id}")
            ->assertOk()
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id', 'title', 'company_name', 'description',
                    'budget_min', 'budget_max', 'deadline', 'status',
                    'required_skills', 'attachments', 'bids_count', 'category',
                ],
            ])
            ->assertJsonPath('data.id', $job->id);
    }

    public function test_job_detail_returns_404_for_missing_job(): void
    {
        $this->getJson('/api/jobs/999')->assertNotFound();
    }

    public function test_job_detail_includes_user_bid_status_when_authenticated(): void
    {
        $user = User::factory()->create();
        $job = Job::factory()->create();
        Bid::factory()->create(['user_id' => $user->id, 'job_id' => $job->id]);

        $this->actingAs($user, 'sanctum')
            ->getJson("/api/jobs/{$job->id}")
            ->assertOk()
            ->assertJsonPath('data.user_bid.status', 'pending');
    }

    public function test_job_detail_returns_null_user_bid_when_authenticated_without_bid(): void
    {
        $user = User::factory()->create();
        $job = Job::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->getJson("/api/jobs/{$job->id}")
            ->assertOk()
            ->assertJsonPath('data.user_bid', null);
    }

    public function test_job_detail_omits_user_bid_for_guests(): void
    {
        $job = Job::factory()->create();

        $response = $this->getJson("/api/jobs/{$job->id}")->assertOk();

        $this->assertArrayNotHasKey('user_bid', $response->json('data'));
    }
}
