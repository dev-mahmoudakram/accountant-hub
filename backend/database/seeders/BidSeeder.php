<?php

namespace Database\Seeders;

use App\Enums\BidStatus;
use App\Models\Bid;
use App\Models\Job;
use App\Models\User;
use Illuminate\Database\Seeder;

class BidSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $jobs = Job::all();

        $coverLetters = [
            "I have over 5 years of experience in this area and would be delighted to bring my expertise to your project. My recent work with similar clients has consistently delivered accurate, on-time results.\n\nI am proficient with all major accounting software and pride myself on clear communication throughout the engagement.",
            "Your project aligns perfectly with my professional background. I have handled similar engagements for clients in your industry and understand the nuances involved.\n\nI am available to start immediately and can commit dedicated hours to ensure timely delivery.",
            "As a CPA with 8 years of hands-on experience, I am confident I can exceed your expectations on this project. I have a proven track record of delivering quality work within budget.\n\nPlease feel free to ask for references from previous clients in similar roles.",
            "This project is right in my wheelhouse. I specialize in exactly this type of work and have the tools, knowledge, and availability to deliver exceptional results.\n\nI look forward to discussing how we can work together.",
        ];

        $experienceSummaries = [
            "CPA certified with 6 years of public accounting experience at a mid-size firm. Specialized in small business bookkeeping, tax compliance, and financial reporting. Clients range from startups to established SMEs across retail, technology, and professional services.",
            "Former Big 4 audit associate with 4 years of experience. Now freelancing full-time, focusing on audit support, financial statement preparation, and compliance work for growth-stage companies.",
            "Bookkeeping and payroll specialist with 7 years of experience. Expert in QuickBooks, Xero, and Sage. Have managed payroll for teams of up to 150 employees and handled multi-state tax compliance.",
            "Tax accountant with deep expertise in corporate tax, individual returns, and international tax compliance. 9 years of experience across public accounting and in-house roles.",
        ];

        $placedBids = [];

        foreach ($users as $user) {
            $jobSample = $jobs->shuffle()->take(rand(3, 7));

            foreach ($jobSample as $job) {
                $key = "{$user->id}-{$job->id}";

                if (isset($placedBids[$key])) {
                    continue;
                }

                $placedBids[$key] = true;

                Bid::create([
                    'user_id' => $user->id,
                    'job_id' => $job->id,
                    'proposed_price' => rand((int) $job->budget_min, (int) $job->budget_max),
                    'estimated_delivery_time' => collect(['1 week', '2 weeks', '3 weeks', '1 month'])->random(),
                    'cover_letter' => $coverLetters[array_rand($coverLetters)],
                    'experience_summary' => $experienceSummaries[array_rand($experienceSummaries)],
                    'status' => BidStatus::Pending,
                ]);
            }
        }
    }
}
