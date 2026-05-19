<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Demo clients who post jobs
        $clients = [
            ['name' => 'Alex Morgan', 'email' => 'alex@accountant-hub.test'],
            ['name' => 'Jordan Lee', 'email' => 'jordan@accountant-hub.test'],
            ['name' => 'Chris Evans', 'email' => 'chris@accountant-hub.test'],
        ];

        foreach ($clients as $data) {
            User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'password' => Hash::make('password'),
                    'role' => UserRole::Client,
                ]
            );
        }

        // Demo accountants who bid on jobs
        $accountants = [
            ['name' => 'Demo Accountant', 'email' => 'demo@accountant-hub.test'],
            ['name' => 'Sarah Mitchell', 'email' => 'sarah@accountant-hub.test'],
            ['name' => 'James Carter', 'email' => 'james@accountant-hub.test'],
            ['name' => 'Priya Sharma', 'email' => 'priya@accountant-hub.test'],
            ['name' => 'Thomas Nguyen', 'email' => 'thomas@accountant-hub.test'],
        ];

        foreach ($accountants as $data) {
            User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'password' => Hash::make('password'),
                    'role' => UserRole::Accountant,
                ]
            );
        }

        $this->call([
            JobCategorySeeder::class,
            JobSeeder::class,
            BidSeeder::class,
        ]);
    }
}
