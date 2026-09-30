<?php

namespace App\Notifications;

use App\Models\Lease;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LeaseExpiringNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * @param Lease $lease
     * @param string $recipientType 'tenant' or 'landlord'
     */
    public function __construct(
        public Lease  $lease,
        public string $recipientType = 'tenant'
    )
    {
    }

    /**
     * @param object $notifiable
     * @return string[]
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * @param object $notifiable
     * @return MailMessage
     */
    public function toMail(object $notifiable): MailMessage
    {
        $roomNumber = $this->lease->room?->room_number ?? 'N/A';
        $endDate = $this->lease->end_date ? $this->lease->end_date->format('F j, Y') : 'N/A';

        if ($this->recipientType === 'landlord') {
            $tenantName = $this->lease->tenant?->first_name
                ? "{$this->lease->tenant->first_name} {$this->lease->tenant->last_name}"
                : 'a tenant';

            return (new MailMessage)
                ->subject("Lease Expiring Soon: Room {$roomNumber}")
                ->greeting("Hello {$notifiable->name},")
                ->line("The lease for Room {$roomNumber} (Tenant: {$tenantName}) is set to expire on **{$endDate}**.")
                ->action('Manage Lease', url("/leases/{$this->lease->id}"))
                ->line('Consider initiating a renewal or preparing for tenant move-out.');
        }

        // Tenant Notification
        $tenantName = $this->lease->tenant?->first_name ?? 'Valued Tenant';

        return (new MailMessage)
            ->subject("Notice: Your Lease for Room {$roomNumber} is Expiring Soon")
            ->greeting("Hello {$tenantName},")
            ->line("This is a friendly reminder that your lease for Room {$roomNumber} will expire on **{$endDate}**.")
            ->line('Please contact your property manager if you wish to renew your lease agreement.')
            ->action('View Lease Agreement', url("/leases/{$this->lease->id}"));
    }
}
