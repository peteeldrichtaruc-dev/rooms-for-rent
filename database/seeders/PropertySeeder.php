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
        $users = User::where('role', 'landlord')->get();

        Property::factory()
            ->count(100)
            ->recycle($users)
            ->create();
    }
}
