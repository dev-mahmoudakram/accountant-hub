<?php

namespace Database\Factories;

use App\Enums\JobStatus;
use App\Models\JobCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

class JobFactory extends Factory
{
    private static array $titles = [
        'Bookkeeper Needed for Small E-commerce Business',
        'Monthly Financial Statements Preparation',
        'Tax Return Filing for LLC — 2024',
        'Payroll Processing for 30-Person Team',
        'Annual Audit Support for Nonprofit',
        'QuickBooks Setup & Chart of Accounts Cleanup',
        'VAT Returns & Compliance — EU Market',
        'CFO Advisory for Series A Startup',
        'Cash Flow Forecasting & Budget Modeling',
        'Accounts Payable & Receivable Management',
        'Corporate Tax Planning & Strategy',
        'Year-End Financial Close Support',
        'Construction Company Job Costing Setup',
        'E-commerce Sales Tax Compliance (Multi-State)',
        'International Transfer Pricing Review',
        'Forensic Accounting — Fraud Investigation',
        'Inventory Accounting & Reconciliation',
        'Restaurant Chain Monthly Bookkeeping',
        'Property Management Accounting',
        'Startup Financial Model & Projections',
        'R&D Tax Credit Claim Preparation',
        'Mergers & Acquisitions Due Diligence',
        'Payroll Tax Deposits & 941 Filings',
        'Non-Profit IRS Form 990 Preparation',
        'Healthcare Practice Revenue Cycle Review',
        'Crypto Portfolio Tax Reporting',
        'SaaS Metrics Dashboard & MRR Reporting',
        'Import/Export Customs Duty Accounting',
        'Employee Expense Reimbursement Audit',
        'Board-Ready Financial Presentation',
    ];

    private static array $companies = [
        'NovaTech Solutions', 'Greenfield Retail', 'BlueSky Ventures',
        'Pinnacle Health Group', 'Atlas Construction', 'Meridian Hospitality',
        'Summit Digital Agency', 'Pacific Imports Co.', 'Ember Nonprofit Foundation',
        'Ironwood Manufacturing', 'Coastal Properties LLC', 'Apex Logistics',
        'BrightPath Education', 'Stellar Fintech Inc.', 'Redwood Consulting',
    ];

    private static int $titleIndex = 0;

    public function definition(): array
    {
        $title = self::$titles[self::$titleIndex % count(self::$titles)];
        self::$titleIndex++;

        $budgetMin = fake()->randomElement([500, 800, 1000, 1500, 2000, 3000, 5000]);
        $budgetMax = $budgetMin + fake()->randomElement([500, 1000, 2000, 3000, 5000]);

        return [
            'category_id' => JobCategory::inRandomOrder()->value('id') ?? JobCategory::factory(),
            'title' => $title,
            'company_name' => fake()->randomElement(self::$companies),
            'short_description' => fake()->sentence(18),
            'description' => implode("\n\n", fake()->paragraphs(3)),
            'budget_min' => $budgetMin,
            'budget_max' => $budgetMax,
            'deadline' => fake()->dateTimeBetween('+2 weeks', '+6 months')->format('Y-m-d'),
            'expected_delivery_time' => fake()->randomElement([
                '1 week', '2 weeks', '3 weeks', '1 month', '6 weeks', '2 months',
            ]),
            'required_skills' => fake()->randomElements([
                'QuickBooks', 'Xero', 'Excel', 'GAAP', 'IFRS', 'Tax Law',
                'Payroll', 'Audit', 'Sage', 'NetSuite', 'SAP', 'Power BI',
            ], fake()->numberBetween(2, 5)),
            'attachments' => null,
            'status' => fake()->randomElement([
                JobStatus::Open, JobStatus::Open, JobStatus::Open, JobStatus::Open,
                JobStatus::Closed,
            ]),
        ];
    }

    public function open(): static
    {
        return $this->state(['status' => JobStatus::Open]);
    }

    public function closed(): static
    {
        return $this->state(['status' => JobStatus::Closed]);
    }
}
