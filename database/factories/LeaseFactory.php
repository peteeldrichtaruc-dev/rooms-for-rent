<?php

namespace Database\Factories;

use App\Models\Lease;
use App\Models\Room;
use App\Models\Renter;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Lease>
 */
class LeaseFactory extends Factory
{
    protected $model = Lease::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     * @throws \DateMalformedStringException
     */
    public function definition(): array
    {
        $startDate = fake()->dateTimeBetween('-1 year', 'now');
        $durationMonths = fake()->randomElement([6, 12, 24]);
        $endDate = (clone $startDate)->modify("+{$durationMonths} months");
        $status = fake()->randomElement(['active', 'active', 'active', 'ended', 'terminated']);

        return [
            'room_id' => Room::factory(),
            'renter_id' => Renter::factory(),
            'start_date' => $startDate->format('Y-m-d'),
            'end_date' => $endDate->format('Y-m-d'),
            'rent_amount' => fake()->randomElement([3500.00, 4500.00, 5500.00, 6500.00, 8000.00, 12000.00]),
            'deposit_amount' => function (array $attributes) {
                // 1 or 2 months security deposit based on rent_amount
                return $attributes['rent_amount'] * fake()->randomElement([1, 2]);
            },
            'status' => $status,
            'notes' => fake()->boolean(40)
                ? fake()->randomElement([
                    'Standard 1-year contract signed with 2 months advance deposit.',
                    'Lease renewed for another 6-month period.',
                    'Renter requested early termination due to job relocation.',
                    'Includes free water utility, electricity submetered.',
                ])
                : null,
            'created_at' => $startDate,
            'updated_at' => $startDate,
        ];
    }
}
