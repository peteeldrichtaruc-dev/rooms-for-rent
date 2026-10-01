<?php

namespace Database\Seeders;

use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Seeder;

class PropertySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure at least one primary test user exists to attach properties to
        $user = User::first() ?? User::factory()->create([
            'name' => 'Admin Landlord',
            'email' => 'admin@example.com',
        ]);

        // Option A: Assign 100 properties directly to your primary test user
        Property::factory()
            ->count(100)
            ->create([
                'user_id' => $user->id,
            ]);

        /*
        // Option B (Alternative): Distribute 100 properties across multiple landlords
        $users = User::count() >= 5 ? User::all() : User::factory(5)->create();

        Property::factory()
            ->count(100)
            ->recycle($users)
            ->create();
        */
    }
}
