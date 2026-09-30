<?php

namespace App\Notifications;

use App\Broadcasting\SmsLogChannel;
use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use NotificationChannels\Twilio\TwilioChannel;
use NotificationChannels\Twilio\TwilioSmsMessage;

class InvoiceOverdueNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * @param Invoice $invoice
     * @param string $recipientType 'tenant' or 'landlord'
     */
    public function __construct(
        public Invoice $invoice,
        public string  $recipientType = 'tenant'
    )
    {
    }

    /**
     * Determine delivery channels based on recipient type and available contact info.
     *
     * @param object $notifiable
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        $channels = ['mail'];

        // Dispatch local SMS log notification for tenants with phone numbers
        if ($this->recipientType === 'tenant') {
            $phoneNumber = method_exists($notifiable, 'routeNotificationForTwilio')
                ? $notifiable->routeNotificationForTwilio()
                : ($notifiable->phone ?? null);

            if (!empty($phoneNumber)) {
                $channels[] = TwilioChannel::class;
                $channels[] = SmsLogChannel::class;
            }
        }

        return $channels;
    }

    /**
     * @param object $notifiable
     * @return MailMessage
     */
    public function toMail(object $notifiable): MailMessage
    {
        $roomNumber = $this->invoice->lease?->room?->room_number ?? 'N/A';
        $formattedAmount = number_format($this->invoice->amount, 2);
        $dueDate = $this->invoice->due_date ? $this->invoice->due_date->format('F j, Y') : 'N/A';

        if ($this->recipientType === 'landlord') {
            $tenantName = $this->invoice->lease?->tenant?->first_name
                ? "{$this->invoice->lease->tenant->first_name} {$this->invoice->lease->tenant->last_name}"
                : 'a tenant';

            return (new MailMessage)
                ->subject("Overdue Payment Alert: Room {$roomNumber}")
                ->greeting("Hello {$notifiable->name},")
                ->line("Invoice #{$this->invoice->id} for Room {$roomNumber} (Tenant: {$tenantName}) is now marked as **OVERDUE**.")
                ->line("Amount Due: ₱{$formattedAmount}")
                ->line("Original Due Date: {$dueDate}")
                ->action('View Invoice Details', url("/invoices/{$this->invoice->id}"))
                ->line('Please review the invoice on your dashboard.');
        }

        // Tenant Notification
        $tenantName = $this->invoice->lease?->tenant?->first_name ?? 'Valued Tenant';

        return (new MailMessage)
            ->subject("OVERDUE NOTICE: Invoice #{$this->invoice->id} for Room {$roomNumber}")
            ->greeting("Hello {$tenantName},")
            ->line("Your rent invoice for Room {$roomNumber} was due on **{$dueDate}** and is now overdue.")
            ->line("Outstanding Balance: ₱{$formattedAmount}")
            ->action('Pay Now', url("/invoices/{$this->invoice->id}"))
            ->line('Please process your payment as soon as possible to avoid any late penalties.');
    }

    /**
     * Build the SMS representation for Twilio.
     *
     * @param object $notifiable
     * @return TwilioSmsMessage
     */
    public function toTwilio(object $notifiable): TwilioSmsMessage
    {
        $roomNumber = $this->invoice->lease?->room?->room_number ?? 'N/A';
        $formattedAmount = number_format($this->invoice->amount, 2);

        return (new TwilioSmsMessage)
            ->content("RoomsForRent Alert: Your rent invoice #{$this->invoice->id} for Room {$roomNumber} (₱{$formattedAmount}) is OVERDUE. Please process payment as soon as possible.");
    }

    /**
     * Build SMS content for local log driver.
     *
     * @param object $notifiable
     * @return string
     */
    public function toSms(object $notifiable): string
    {
        $roomNumber = $this->invoice->lease?->room?->room_number ?? 'N/A';
        $formattedAmount = number_format($this->invoice->amount, 2);

        return "RoomsForRent Alert: Rent invoice #{$this->invoice->id} for Room {$roomNumber} (₱{$formattedAmount}) is OVERDUE. Please process payment as soon as possible.";
    }
}
