<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class JobCategoryFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->unique()->randomElement([
            'Bookkeeping',
            'Tax Preparation',
            'Audit & Assurance',
            'Payroll Management',
            'Financial Reporting',
            'Financial Advisory',
            'Management Accounting',
            'Forensic Accounting',
        ]);

        return [
            'name' => $name,
            'slug' => Str::slug($name),
        ];
    }
}
