<?php

namespace Database\Factories;

use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Property>
 */
class PropertyFactory extends Factory
{
    protected $model = Property::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $philippineCities = [
            ['city' => 'Cebu City', 'state' => 'Cebu', 'postal_code' => '6000'],
            ['city' => 'Mandaue City', 'state' => 'Cebu', 'postal_code' => '6014'],
            ['city' => 'Lapu-Lapu City', 'state' => 'Cebu', 'postal_code' => '6015'],
            ['city' => 'Cagayan de Oro', 'state' => 'Misamis Oriental', 'postal_code' => '9000'],
            ['city' => 'Davao City', 'state' => 'Davao del Sur', 'postal_code' => '8000'],
            ['city' => 'Quezon City', 'state' => 'Metro Manila', 'postal_code' => '1100'],
            ['city' => 'Makati', 'state' => 'Metro Manila', 'postal_code' => '1200'],
            ['city' => 'Taguig', 'state' => 'Metro Manila', 'postal_code' => '1630'],
            ['city' => 'Iloilo City', 'state' => 'Iloilo', 'postal_code' => '5000'],
            ['city' => 'Bacolod', 'state' => 'Negros Occidental', 'postal_code' => '6100'],
        ];

        $location = fake()->randomElement($philippineCities);

        $propertyPrefixes = ['Vista', 'Grand', 'Urban', 'Central', 'Emerald', 'Pacific', 'Royal', 'Horizon', 'Sunrise', 'Haven'];
        $propertyTypes = ['Residences', 'Apartments', 'Boarding House', 'Suites', 'Tower', 'Dormitory', 'Villas', 'Heights'];

        $name = fake()->randomElement($propertyPrefixes) . ' ' . fake()->firstName() . ' ' . fake()->randomElement($propertyTypes);

        return [
            'user_id' => User::factory(),
            'name' => $name,
            'address' => fake()->streetAddress() . ', Brgy. ' . fake()->lastName(),
            'city' => $location['city'],
            'state' => $location['state'],
            'postal_code' => $location['postal_code'],
            'country' => 'Philippines',
            'description' => fake()->boolean(80)
                ? fake()->paragraph(2)
                : null,
            'created_at' => fake()->dateTimeBetween('-1 year', 'now'),
            'updated_at' => function (array $attributes) {
                return $attributes['created_at'];
            },
        ];
    }
}
