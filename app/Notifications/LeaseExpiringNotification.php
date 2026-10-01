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
     * @param string $recipientType 'renter' or 'landlord'
     */
    public function __construct(
        public Lease  $lease,
        public string $recipientType = 'renter'
    ) {}

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
            $renterName = $this->lease->renter?->first_name
                ? "{$this->lease->renter->first_name} {$this->lease->renter->last_name}"
                : 'a renter';

            return (new MailMessage)
                ->subject("Lease Expiring Soon: Room {$roomNumber}")
                ->greeting("Hello {$notifiable->name},")
                ->line("The lease for Room {$roomNumber} (Renter: {$renterName}) is set to expire on **{$endDate}**.")
                ->action('Manage Lease', url("/leases/{$this->lease->id}"))
                ->line('Consider initiating a renewal or preparing for renter move-out.');
        }

        // Renter Notification
        $renterName = $this->lease->renter?->first_name ?? 'Valued Renter';

        return (new MailMessage)
            ->subject("Notice: Your Lease for Room {$roomNumber} is Expiring Soon")
            ->greeting("Hello {$renterName},")
            ->line("This is a friendly reminder that your lease for Room {$roomNumber} will expire on **{$endDate}**.")
            ->line('Please contact your property manager if you wish to renew your lease agreement.')
            ->action('View Lease Agreement', url("/leases/{$this->lease->id}"));
    }
}
