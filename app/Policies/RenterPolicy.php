<?php

namespace App\Policies;

use App\Models\Renter;
use App\Models\User;

/**
 * Class RenterPolicy
 *
 * Handles authorization checks for renter management actions.
 * Ensures users can only access or modify renter records they own.
 *
 * @package App\Policies
 */
class RenterPolicy
{
    /**
     * Determine whether the user can view any renter records.
     *
     * @param User $user
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view a specific renter's profile.
     *
     * @param User $user
     * @param Renter $renter
     * @return bool
     */
    public function view(User $user, Renter $renter): bool
    {
        return $user->id === $renter->user_id;
    }

    /**
     * Determine whether the user can create new renter records.
     *
     * @param User $user
     * @return bool
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the given renter record.
     *
     * @param User $user
     * @param Renter $renter
     * @return bool
     */
    public function update(User $user, Renter $renter): bool
    {
        return $user->id === $renter->user_id;
    }

    /**
     * Determine whether the user can delete the given renter record.
     *
     * @param User $user
     * @param Renter $renter
     * @return bool
     */
    public function delete(User $user, Renter $renter): bool
    {
        return $user->id === $renter->user_id;
    }
}
