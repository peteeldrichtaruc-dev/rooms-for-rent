<?php

namespace Database\Seeders;

use App\Models\Lease;
use App\Models\Room;
use App\Models\Tenant;
use Illuminate\Database\Seeder;

class LeaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rooms = Room::all();
        $tenants = Tenant::all();

        if ($rooms->isEmpty() || $tenants->isEmpty()) {
            $this->command->warn('Rooms or Tenants missing! Please run PropertySeeder, RoomSeeder, and TenantSeeder first.');
            return;
        }

        // 1. Assign Active Leases to a portion of available rooms
        $availableRooms = $rooms->shuffle();
        $tenantPool = $tenants->shuffle();

        // Assign active leases to ~60% of existing rooms
        $activeRoomCount = (int)($rooms->count() * 0.6);

        for ($i = 0; $i < $activeRoomCount; $i++) {
            if ($tenantPool->isEmpty()) {
                break;
            }

            $room = $availableRooms->pop();
            $tenant = $tenantPool->pop();

            Lease::factory()->create([
                'room_id' => $room->id,
                'tenant_id' => $tenant->id,
                'rent_amount' => $room->price,
                'status' => 'active',
                'start_date' => now()->subMonths(rand(1, 6))->format('Y-m-d'),
                'end_date' => now()->addMonths(rand(3, 12))->format('Y-m-d'),
            ]);

            // Sync room status to occupied
            $room->update(['status' => 'occupied']);
        }

        // 2. Generate Past Leases (Ended / Terminated) for historical depth
        $remainingTenants = Tenant::whereDoesntHave('leases', function ($q) {
            $q->where('status', 'active');
        })->get();

        foreach ($remainingTenants->take(15) as $tenant) {
            $randomRoom = $rooms->random();

            Lease::factory()->create([
                'room_id' => $randomRoom->id,
                'tenant_id' => $tenant->id,
                'rent_amount' => $randomRoom->price,
                'status' => fake()->randomElement(['ended', 'terminated']),
                'start_date' => now()->subMonths(rand(12, 24))->format('Y-m-d'),
                'end_date' => now()->subMonths(rand(1, 11))->format('Y-m-d'),
            ]);
        }
    }
}
