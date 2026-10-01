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
        $users = User::all();

        Renter::factory()
            ->count(50)
            ->recycle($users)
            ->create();
    }
}
