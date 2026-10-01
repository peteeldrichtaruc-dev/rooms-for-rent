<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class LandlordSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Primary Demo Landlord Account
        User::updateOrCreate(
            ['email' => 'landlord@roomsforrent.com'],
            [
                'name' => 'Demo Landlord',
                'password' => Hash::make('password'),
                'role' => User::ROLE_LANDLORD,
                'email_verified_at' => now(),
            ]
        );

        // Additional sample Landlords for testing multi-tenancy
        $sampleLandlords = [
            [
                'name' => 'Juan Dela Cruz',
                'email' => 'juan@roomsforrent.com',
            ],
            [
                'name' => 'Maria Santos',
                'email' => 'maria@roomsforrent.com',
            ],
        ];

        foreach ($sampleLandlords as $landlord) {
            User::updateOrCreate(
                ['email' => $landlord['email']],
                [
                    'name' => $landlord['name'],
                    'password' => Hash::make('password'),
                    'role' => User::ROLE_LANDLORD,
                    'email_verified_at' => now(),
                ]
            );
        }
    }
}
