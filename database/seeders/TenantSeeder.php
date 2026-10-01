<?php

namespace Database\Seeders;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Seeder;

class TenantSeeder extends Seeder
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

        // Seed 50 tenants attached to the landlord user
        Tenant::factory()
            ->count(50)
            ->create([
                'user_id' => $user->id,
            ]);
    }
}
