<?php

namespace Database\Seeders;

use App\Models\Renter;
use App\Models\User;
use Illuminate\Database\Seeder;

class RenterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the primary landlord user or create one
        $user = User::first() ?? User::factory()->create([
            'name' => 'Admin Landlord',
            'email' => 'admin@example.com',
        ]);

        // Seed 50 renters attached to the landlord user
        Renter::factory()
            ->count(50)
            ->create([
                'user_id' => $user->id,
            ]);
    }
}
