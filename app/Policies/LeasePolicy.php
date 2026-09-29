<?php

namespace App\Policies;

use App\Models\Lease;
use App\Models\User;

class LeasePolicy
{
    /**
     * Determine whether the user can view any leases.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the lease.
     */
    public function view(User $user, Lease $lease): bool
    {
        return $user->id === $lease->room->property->user_id || $user->id === $lease->tenant_id;
    }

    /**
     * Determine whether the user can create leases.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the lease.
     */
    public function update(User $user, Lease $lease): bool
    {
        return $user->id === $lease->room->property->user_id;
    }

    /**
     * Determine whether the user can delete/terminate the lease.
     */
    public function delete(User $user, Lease $lease): bool
    {
        return $user->id === $lease->room->property->user_id;
    }
}
