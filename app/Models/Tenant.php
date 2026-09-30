<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;

/**
 * Class Tenant
 *
 * Represents a tenant (renter) profile within the property management system.
 *
 * @package App\Models
 */
class Tenant extends Model
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'emergency_contact_name',
        'emergency_contact_phone',
        'notes',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'full_name'
    ];

    /**
     * Get the tenant's combined full name.
     *
     * Automatically appended to the model's array/JSON representation via the $appends array.
     *
     * @return string
     */
    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    /**
     * Route notifications for the Mail channel.
     *
     * Falls back to the tenant's direct email if no linked user account exists.
     *
     * @return string
     */
    public function routeNotificationForMail(): string
    {
        return $this->user?->email ?? $this->email;
    }

    /**
     * Route notifications for the Twilio SMS channel.
     *
     * @return string|null
     */
    public function routeNotificationForTwilio(): ?string
    {
        return $this->phone;
    }

    /**
     * Get the user (landlord/property manager) that created and manages this tenant.
     *
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the lease agreements associated with this tenant.
     *
     * @return HasMany
     */
    public function leases(): HasMany
    {
        return $this->hasMany(Lease::class);
    }
}
