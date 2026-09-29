<?php

namespace App\Policies;

use App\Models\Tenant;
use App\Models\User;

/**
 * Class TenantPolicy
 *
 * Handles authorization checks for tenant management actions.
 * Ensures users can only access or modify tenant records they own.
 *
 * @package App\Policies
 */
class TenantPolicy
{
    /**
     * Determine whether the user can view any tenant records.
     *
     * @param User $user
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view a specific tenant's profile.
     *
     * @param User $user
     * @param Tenant $tenant
     * @return bool
     */
    public function view(User $user, Tenant $tenant): bool
    {
        return $user->id === $tenant->user_id;
    }

    /**
     * Determine whether the user can create new tenant records.
     *
     * @param User $user
     * @return bool
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the given tenant record.
     *
     * @param User $user
     * @param Tenant $tenant
     * @return bool
     */
    public function update(User $user, Tenant $tenant): bool
    {
        return $user->id === $tenant->user_id;
    }

    /**
     * Determine whether the user can delete the given tenant record.
     *
     * @param User $user
     * @param Tenant $tenant
     * @return bool
     */
    public function delete(User $user, Tenant $tenant): bool
    {
        return $user->id === $tenant->user_id;
    }
}
