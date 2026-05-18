<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Demo accountant — fixed credentials for assessment
        User::firstOrCreate(
            ['email' => 'demo@accountant-hub.test'],
            [
                'name' => 'Demo Accountant',
                'password' => Hash::make('password'),
            ]
        );

        // Additional demo users
        $extraUsers = [
            ['name' => 'Sarah Mitchell', 'email' => 'sarah@accountant-hub.test'],
            ['name' => 'James Carter', 'email' => 'james@accountant-hub.test'],
            ['name' => 'Priya Sharma', 'email' => 'priya@accountant-hub.test'],
            ['name' => 'Thomas Nguyen', 'email' => 'thomas@accountant-hub.test'],
        ];

        foreach ($extraUsers as $userData) {
            User::firstOrCreate(
                ['email' => $userData['email']],
                ['name' => $userData['name'], 'password' => Hash::make('password')]
            );
        }

        $this->call([
            JobCategorySeeder::class,
            JobSeeder::class,
            BidSeeder::class,
        ]);
    }
}
