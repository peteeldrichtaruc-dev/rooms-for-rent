<?php

namespace App\Policies;

use App\Models\Invoice;
use App\Models\User;

/**
 * Class InvoicePolicy
 *
 * Handles authorization checks for billing and invoice management.
 *
 * @package App\Policies
 */
class InvoicePolicy
{
    /**
     * Determine whether the user can view any invoice records.
     *
     * @param User $user
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view a specific invoice.
     *
     * @param User $user
     * @param Invoice $invoice
     * @return bool
     */
    public function view(User $user, Invoice $invoice): bool
    {
        return $user->id === $invoice->user_id;
    }

    /**
     * Determine whether the user can generate new invoices.
     *
     * @param User $user
     * @return bool
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the given invoice.
     *
     * @param User $user
     * @param Invoice $invoice
     * @return bool
     */
    public function update(User $user, Invoice $invoice): bool
    {
        return $user->id === $invoice->user_id;
    }

    /**
     * Determine whether the user can delete the given invoice.
     *
     * @param User $user
     * @param Invoice $invoice
     * @return bool
     */
    public function delete(User $user, Invoice $invoice): bool
    {
        return $user->id === $invoice->user_id;
    }
}
