<?php

namespace App\Policies;

use App\Models\Property;
use App\Models\User;

class PropertyPolicy
{
    /**
     * Determine whether the user can view any property models.
     *
     * @param User $user
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        // Any authenticated user can access their property index list
        return true;
    }

    /**
     * Determine whether the user can view the specified property model.
     *
     * @param User $user
     * @param Property $property
     * @return bool
     */
    public function view(User $user, Property $property): bool
    {
        // Users can only view properties that they own
        return $user->id === $property->user_id;
    }

    /**
     * Determine whether the user can create property models.
     *
     * @param User $user
     * @return bool
     */
    public function create(User $user): bool
    {
        // Any authenticated property manager can register new properties
        return true;
    }

    /**
     * Determine whether the user can update the specified property model.
     *
     * @param User $user
     * @param Property $property
     * @return bool
     */
    public function update(User $user, Property $property): bool
    {
        // Users can only edit properties that they own
        return $user->id === $property->user_id;
    }

    /**
     * Determine whether the user can delete the specified property model.
     *
     * @param User $user
     * @param Property $property
     * @return bool
     */
    public function delete(User $user, Property $property): bool
    {
        // Users can only delete properties that belong to their account
        return $user->id === $property->user_id;
    }
}
