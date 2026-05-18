<?php

namespace Database\Seeders;

use App\Models\JobCategory;
use Illuminate\Database\Seeder;

class JobCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Bookkeeping', 'slug' => 'bookkeeping'],
            ['name' => 'Tax Preparation', 'slug' => 'tax-preparation'],
            ['name' => 'Audit & Assurance', 'slug' => 'audit-assurance'],
            ['name' => 'Payroll Management', 'slug' => 'payroll-management'],
            ['name' => 'Financial Reporting', 'slug' => 'financial-reporting'],
            ['name' => 'Financial Advisory', 'slug' => 'financial-advisory'],
        ];

        foreach ($categories as $category) {
            JobCategory::firstOrCreate(['slug' => $category['slug']], $category);
        }
    }
}
