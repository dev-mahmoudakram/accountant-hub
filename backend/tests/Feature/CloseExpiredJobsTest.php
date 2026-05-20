<?php

namespace Tests\Feature;

use App\Enums\JobStatus;
use App\Models\Job;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CloseExpiredJobsTest extends TestCase
{
    use RefreshDatabase;

    // -------------------------------------------------------------------------
    // jobs:close-expired command
    // -------------------------------------------------------------------------

    public function test_command_closes_open_jobs_past_deadline(): void
    {
        $expired = Job::factory()->create([
            'status' => JobStatus::Open,
            'deadline' => now()->subDay()->toDateString(),
        ]);

        $this->artisan('jobs:close-expired')->assertSuccessful();

        $this->assertSame(JobStatus::Closed, $expired->fresh()->status);
    }

    public function test_command_leaves_jobs_with_future_deadline_open(): void
    {
        $future = Job::factory()->create([
            'status' => JobStatus::Open,
            'deadline' => now()->addWeek()->toDateString(),
        ]);

        $this->artisan('jobs:close-expired')->assertSuccessful();

        $this->assertSame(JobStatus::Open, $future->fresh()->status);
    }

    public function test_command_leaves_jobs_with_todays_deadline_open(): void
    {
        // Today is still within the application window — deadline expires end of day.
        $today = Job::factory()->create([
            'status' => JobStatus::Open,
            'deadline' => now()->toDateString(),
        ]);

        $this->artisan('jobs:close-expired')->assertSuccessful();

        $this->assertSame(JobStatus::Open, $today->fresh()->status);
    }

    public function test_command_does_not_reopen_already_closed_jobs(): void
    {
        $closed = Job::factory()->create([
            'status' => JobStatus::Closed,
            'deadline' => now()->subWeek()->toDateString(),
        ]);

        $this->artisan('jobs:close-expired')->assertSuccessful();

        $this->assertSame(JobStatus::Closed, $closed->fresh()->status);
    }

    // -------------------------------------------------------------------------
    // Lazy-close on read
    // -------------------------------------------------------------------------

    public function test_jobs_listing_lazy_closes_expired_jobs(): void
    {
        $expired = Job::factory()->create([
            'status' => JobStatus::Open,
            'deadline' => now()->subDay()->toDateString(),
        ]);

        $this->getJson('/api/jobs?status=all')->assertOk();

        $this->assertSame(JobStatus::Closed, $expired->fresh()->status);
    }

    public function test_job_detail_lazy_closes_expired_job(): void
    {
        $expired = Job::factory()->create([
            'status' => JobStatus::Open,
            'deadline' => now()->subDay()->toDateString(),
        ]);

        $this->getJson("/api/jobs/{$expired->id}")
            ->assertOk()
            ->assertJsonPath('data.status', 'closed');

        $this->assertSame(JobStatus::Closed, $expired->fresh()->status);
    }
}
