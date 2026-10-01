<?php

namespace Database\Factories;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tenant>
 */
class TenantFactory extends Factory
{
    protected $model = Tenant::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $firstName = fake()->firstName();
        $lastName = fake()->lastName();

        return [
            'user_id' => User::factory(),
            'first_name' => $firstName,
            'last_name' => $lastName,
            'email' => strtolower($firstName . '.' . $lastName . rand(10, 99)) . '@example.com',
            'phone' => '09' . fake()->numberBetween(100000000, 999999999),
            'emergency_contact_name' => fake()->boolean(85)
                ? fake()->name() . ' (' . fake()->randomElement(['Parent', 'Sibling', 'Spouse', 'Relative']) . ')'
                : null,
            'emergency_contact_phone' => function (array $attributes) {
                return $attributes['emergency_contact_name']
                    ? '09' . fake()->numberBetween(100000000, 999999999)
                    : null;
            },
            'notes' => fake()->boolean(50)
                ? fake()->randomElement([
                    'Prefers communication via SMS.',
                    'Student at local university, pays rent on the 5th of every month.',
                    'Submitted government ID copy and proof of employment.',
                    'Working night shifts as a BPO employee.',
                    'Requested additional key duplicate.',
                ])
                : null,
            'created_at' => fake()->dateTimeBetween('-1 year', 'now'),
            'updated_at' => function (array $attributes) {
                return $attributes['created_at'];
            },
        ];
    }
}
