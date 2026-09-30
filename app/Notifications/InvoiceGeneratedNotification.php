<?php

namespace App\Notifications;

use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InvoiceGeneratedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Invoice $invoice)
    {
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $tenantName = $this->invoice->lease?->tenant?->first_name ?? 'Valued Tenant';
        $roomNumber = $this->invoice->lease?->room?->room_number ?? 'N/A';
        $formattedAmount = number_format($this->invoice->amount, 2);
        $dueDate = $this->invoice->due_date ? $this->invoice->due_date->format('F j, Y') : 'Due on receipt';

        return (new MailMessage)
            ->subject("New Invoice #{$this->invoice->id} for Room {$roomNumber}")
            ->greeting("Hello {$tenantName},")
            ->line("Your monthly rent invoice for Room {$roomNumber} has been generated.")
            ->line("Amount Due: ₱{$formattedAmount}")
            ->line("Due Date: {$dueDate}")
            ->action('View & Pay Invoice', url("/invoices/{$this->invoice->id}"))
            ->line('Thank you for choosing BookRepublic!');
    }
}
