<?php

namespace App\Policies;

use App\Models\Room;
use App\Models\User;

class RoomPolicy
{
    /**
     * Determine whether the user can view any rooms.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the specified room.
     */
    public function view(User $user, Room $room): bool
    {
        return $user->id === $room->property->user_id;
    }

    /**
     * Determine whether the user can create rooms.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the specified room.
     */
    public function update(User $user, Room $room): bool
    {
        return $user->id === $room->property->user_id;
    }

    /**
     * Determine whether the user can delete the specified room.
     */
    public function delete(User $user, Room $room): bool
    {
        return $user->id === $room->property->user_id;
    }
}
