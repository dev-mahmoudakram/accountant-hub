<?php

namespace Database\Seeders;

use App\Enums\JobStatus;
use App\Enums\UserRole;
use App\Models\Job;
use App\Models\JobCategory;
use App\Models\User;
use Illuminate\Database\Seeder;

class JobSeeder extends Seeder
{
    public function run(): void
    {
        $categories = JobCategory::all();
        $clients = User::where('role', UserRole::Client->value)->get();

        $jobs = [
            ['title' => 'Bookkeeper Needed for Small E-commerce Business', 'category' => 'bookkeeping', 'budget_min' => 500, 'budget_max' => 1000, 'status' => JobStatus::Open],
            ['title' => 'Monthly Financial Statements Preparation', 'category' => 'financial-reporting', 'budget_min' => 800, 'budget_max' => 1500, 'status' => JobStatus::Open],
            ['title' => 'Tax Return Filing for LLC — 2024', 'category' => 'tax-preparation', 'budget_min' => 600, 'budget_max' => 1200, 'status' => JobStatus::Open],
            ['title' => 'Payroll Processing for 30-Person Team', 'category' => 'payroll-management', 'budget_min' => 1000, 'budget_max' => 2000, 'status' => JobStatus::Open],
            ['title' => 'Annual Audit Support for Nonprofit', 'category' => 'audit-assurance', 'budget_min' => 3000, 'budget_max' => 6000, 'status' => JobStatus::Open],
            ['title' => 'QuickBooks Setup & Chart of Accounts Cleanup', 'category' => 'bookkeeping', 'budget_min' => 400, 'budget_max' => 800, 'status' => JobStatus::Open],
            ['title' => 'VAT Returns & Compliance — EU Market', 'category' => 'tax-preparation', 'budget_min' => 700, 'budget_max' => 1400, 'status' => JobStatus::Open],
            ['title' => 'CFO Advisory for Series A Startup', 'category' => 'financial-advisory', 'budget_min' => 5000, 'budget_max' => 10000, 'status' => JobStatus::Open],
            ['title' => 'Cash Flow Forecasting & Budget Modeling', 'category' => 'financial-advisory', 'budget_min' => 1500, 'budget_max' => 3000, 'status' => JobStatus::Open],
            ['title' => 'Accounts Payable & Receivable Management', 'category' => 'bookkeeping', 'budget_min' => 600, 'budget_max' => 1200, 'status' => JobStatus::Open],
            ['title' => 'Corporate Tax Planning & Strategy', 'category' => 'tax-preparation', 'budget_min' => 2000, 'budget_max' => 4000, 'status' => JobStatus::Open],
            ['title' => 'Year-End Financial Close Support', 'category' => 'financial-reporting', 'budget_min' => 1200, 'budget_max' => 2500, 'status' => JobStatus::Open],
            ['title' => 'E-commerce Sales Tax Compliance (Multi-State)', 'category' => 'tax-preparation', 'budget_min' => 900, 'budget_max' => 1800, 'status' => JobStatus::Open],
            ['title' => 'Startup Financial Model & Projections', 'category' => 'financial-advisory', 'budget_min' => 1500, 'budget_max' => 3500, 'status' => JobStatus::Open],
            ['title' => 'Non-Profit IRS Form 990 Preparation', 'category' => 'tax-preparation', 'budget_min' => 800, 'budget_max' => 1600, 'status' => JobStatus::Open],
            ['title' => 'Crypto Portfolio Tax Reporting', 'category' => 'tax-preparation', 'budget_min' => 500, 'budget_max' => 1000, 'status' => JobStatus::Open],
            ['title' => 'SaaS Metrics Dashboard & MRR Reporting', 'category' => 'financial-reporting', 'budget_min' => 1000, 'budget_max' => 2000, 'status' => JobStatus::Open],
            ['title' => 'Property Management Accounting', 'category' => 'bookkeeping', 'budget_min' => 700, 'budget_max' => 1400, 'status' => JobStatus::Open],
            ['title' => 'Healthcare Practice Revenue Cycle Review', 'category' => 'financial-reporting', 'budget_min' => 2000, 'budget_max' => 5000, 'status' => JobStatus::Open],
            ['title' => 'Board-Ready Financial Presentation', 'category' => 'financial-reporting', 'budget_min' => 800, 'budget_max' => 1500, 'status' => JobStatus::Open],
            ['title' => 'Payroll Tax Deposits & 941 Filings', 'category' => 'payroll-management', 'budget_min' => 500, 'budget_max' => 900, 'status' => JobStatus::Open],
            ['title' => 'Inventory Accounting & Reconciliation', 'category' => 'bookkeeping', 'budget_min' => 600, 'budget_max' => 1200, 'status' => JobStatus::Open],
            ['title' => 'International Transfer Pricing Review', 'category' => 'financial-advisory', 'budget_min' => 4000, 'budget_max' => 8000, 'status' => JobStatus::Open],
            ['title' => 'R&D Tax Credit Claim Preparation', 'category' => 'tax-preparation', 'budget_min' => 1500, 'budget_max' => 3000, 'status' => JobStatus::Open],
            ['title' => 'Restaurant Chain Monthly Bookkeeping', 'category' => 'bookkeeping', 'budget_min' => 800, 'budget_max' => 1600, 'status' => JobStatus::Open],
            // Closed jobs
            ['title' => 'Forensic Accounting — Fraud Investigation', 'category' => 'audit-assurance', 'budget_min' => 5000, 'budget_max' => 12000, 'status' => JobStatus::Closed],
            ['title' => 'Mergers & Acquisitions Due Diligence', 'category' => 'financial-advisory', 'budget_min' => 8000, 'budget_max' => 15000, 'status' => JobStatus::Closed],
            ['title' => 'Employee Expense Reimbursement Audit', 'category' => 'audit-assurance', 'budget_min' => 1000, 'budget_max' => 2000, 'status' => JobStatus::Closed],
            ['title' => 'Construction Company Job Costing Setup', 'category' => 'bookkeeping', 'budget_min' => 1200, 'budget_max' => 2400, 'status' => JobStatus::Closed],
            ['title' => 'Import/Export Customs Duty Accounting', 'category' => 'financial-reporting', 'budget_min' => 700, 'budget_max' => 1400, 'status' => JobStatus::Closed],
        ];

        $skills = [
            'bookkeeping' => ['QuickBooks', 'Xero', 'Excel', 'GAAP', 'Reconciliation'],
            'tax-preparation' => ['Tax Law', 'TurboTax', 'Drake', 'IRS Compliance', 'Excel'],
            'audit-assurance' => ['GAAP', 'IFRS', 'Audit', 'Risk Assessment', 'Excel'],
            'payroll-management' => ['Payroll', 'ADP', 'QuickBooks Payroll', 'Tax Deposits', 'HR Compliance'],
            'financial-reporting' => ['GAAP', 'IFRS', 'Excel', 'Power BI', 'Financial Modeling'],
            'financial-advisory' => ['Financial Modeling', 'Excel', 'Forecasting', 'Strategy', 'Valuation'],
        ];

        $companies = [
            'NovaTech Solutions', 'Greenfield Retail', 'BlueSky Ventures',
            'Pinnacle Health Group', 'Atlas Construction', 'Meridian Hospitality',
            'Summit Digital Agency', 'Pacific Imports Co.', 'Ember Nonprofit Foundation',
            'Ironwood Manufacturing', 'Coastal Properties LLC', 'Apex Logistics',
            'BrightPath Education', 'Stellar Fintech Inc.', 'Redwood Consulting',
        ];

        $deliveryTimes = ['1 week', '2 weeks', '3 weeks', '1 month', '6 weeks', '2 months'];

        foreach ($jobs as $i => $jobData) {
            $category = $categories->firstWhere('slug', $jobData['category']);
            if (! $category) {
                continue;
            }

            $createdAt = now()->subDays(rand(0, 180));

            $job = new Job([
                'user_id' => $clients->get($i % $clients->count())->id,
                'category_id' => $category->id,
                'title' => $jobData['title'],
                'company_name' => $companies[$i % count($companies)],
                'short_description' => "We are looking for an experienced accountant to assist with {$jobData['title']}. Must be detail-oriented and reliable.",
                'description' => "## About the Role\n\nWe need a skilled accounting professional to help us with {$jobData['title']}.\n\n## Responsibilities\n\n- Complete the assigned accounting tasks accurately and on time\n- Communicate progress and flag any issues proactively\n- Deliver clean, documented work product\n\n## Requirements\n\n- Proven experience in relevant accounting discipline\n- Strong attention to detail\n- Excellent communication skills",
                'budget_min' => $jobData['budget_min'],
                'budget_max' => $jobData['budget_max'],
                'deadline' => $createdAt->copy()->addDays(rand(14, 180))->format('Y-m-d'),
                'expected_delivery_time' => $deliveryTimes[$i % count($deliveryTimes)],
                'required_skills' => $skills[$jobData['category']] ?? ['Accounting', 'Excel', 'GAAP'],
                'attachments' => null,
                'status' => $jobData['status'],
            ]);

            $job->created_at = $createdAt;
            $job->updated_at = $createdAt;
            $job->save();
        }
    }
}
