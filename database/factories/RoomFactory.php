<?php

namespace Database\Factories;

use App\Models\Property;
use App\Models\Room;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Room>
 */
class RoomFactory extends Factory
{
    protected $model = Room::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $roomFormats = [
            '10' . fake()->numberBetween(1, 9),
            '20' . fake()->numberBetween(1, 9),
            '30' . fake()->numberBetween(1, 9),
            'Unit ' . fake()->numberBetween(101, 410),
            'Room ' . fake()->unique()->numberBetween(1, 999),
            'Suite ' . fake()->numberBetween(1, 20),
        ];

        return [
            'property_id' => Property::factory(),
            'room_number' => fake()->randomElement($roomFormats),
            'capacity' => fake()->randomElement([1, 1, 2, 2, 3, 4]),
            'price' => fake()->randomElement([3500.00, 4500.00, 5500.00, 6500.00, 8000.00, 12000.00]),
            'status' => fake()->randomElement(['available', 'available', 'occupied', 'occupied', 'maintenance']),
            'description' => fake()->boolean(70)
                ? fake()->randomElement([
                    'Air-conditioned single room with study desk and private bath.',
                    'Spacious studio unit with kitchenette and balcony view.',
                    'Double occupancy room with bunk beds and shared bathroom access.',
                    'Fully furnished room with submetered electricity and free Wi-Fi.',
                    'Cozy unit near the main entrance with built-in cabinet.',
                ])
                : null,
            'created_at' => fake()->dateTimeBetween('-1 year', 'now'),
            'updated_at' => function (array $attributes) {
                return $attributes['created_at'];
            },
        ];
    }
}
