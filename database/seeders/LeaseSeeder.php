<?php

namespace Database\Seeders;

use App\Models\Lease;
use App\Models\Room;
use App\Models\Renter;
use Illuminate\Database\Seeder;

class LeaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rooms = Room::all();
        $renters = Renter::all();

        if ($rooms->isEmpty() || $renters->isEmpty()) {
            $this->command->warn('Rooms or Renters missing! Please run PropertySeeder, RoomSeeder, and RenterSeeder first.');
            return;
        }

        // 1. Assign Active Leases to a portion of available rooms
        $availableRooms = $rooms->shuffle();
        $renterPool = $renters->shuffle();

        // Assign active leases to ~60% of existing rooms
        $activeRoomCount = (int)($rooms->count() * 0.6);

        for ($i = 0; $i < $activeRoomCount; $i++) {
            if ($renterPool->isEmpty()) {
                break;
            }

            $room = $availableRooms->pop();
            $renter = $renterPool->pop();

            Lease::factory()->create([
                'room_id' => $room->id,
                'renter_id' => $renter->id,
                'rent_amount' => $room->price,
                'status' => 'active',
                'start_date' => now()->subMonths(rand(1, 6))->format('Y-m-d'),
                'end_date' => now()->addMonths(rand(3, 12))->format('Y-m-d'),
            ]);

            // Sync room status to occupied
            $room->update(['status' => 'occupied']);
        }

        // 2. Generate Past Leases (Ended / Terminated) for historical depth
        $remainingRenters = Renter::whereDoesntHave('leases', function ($q) {
            $q->where('status', 'active');
        })->get();

        foreach ($remainingRenters->take(15) as $renter) {
            $randomRoom = $rooms->random();

            Lease::factory()->create([
                'room_id' => $randomRoom->id,
                'renter_id' => $renter->id,
                'rent_amount' => $randomRoom->price,
                'status' => fake()->randomElement(['ended', 'terminated']),
                'start_date' => now()->subMonths(rand(12, 24))->format('Y-m-d'),
                'end_date' => now()->subMonths(rand(1, 11))->format('Y-m-d'),
            ]);
        }
    }
}
