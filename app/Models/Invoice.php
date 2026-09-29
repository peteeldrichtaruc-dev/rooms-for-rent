<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Class Invoice
 *
 * Represents a billing statement or payment invoice linked to a lease agreement.
 *
 * @package App\Models
 */
class Invoice extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'lease_id',
        'invoice_number',
        'amount',
        'due_date',
        'paid_at',
        'status',
        'payment_method',
        'description',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'due_date' => 'date:Y-m-d',
        'paid_at' => 'date:Y-m-d',
        'amount' => 'decimal:2',
    ];

    /**
     * Get the user (landlord/property manager) who owns this invoice.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the lease agreement associated with this invoice.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function lease(): BelongsTo
    {
        return $this->belongsTo(Lease::class);
    }
}
