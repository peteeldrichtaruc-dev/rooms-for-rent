<?php

namespace Database\Seeders;

use App\Models\Property;
use App\Models\Room;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $properties = Property::all();

        // If no properties exist, create 10 sample properties first
        if ($properties->isEmpty()) {
            $properties = Property::factory()->count(10)->create();
        }

        // Generate between 3 to 10 rooms per property
        foreach ($properties as $property) {
            $roomCount = rand(3, 10);

            for ($i = 1; $i <= $roomCount; $i++) {
                Room::factory()->create([
                    'property_id' => $property->id,
                    'room_number' => 'Room ' . (100 + $i),
                ]);
            }
        }
    }
}
