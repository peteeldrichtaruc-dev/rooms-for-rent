<?php

namespace App\Notifications;

use App\Broadcasting\SmsLogChannel;
use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\URL;
use NotificationChannels\Twilio\TwilioChannel;
use NotificationChannels\Twilio\TwilioSmsMessage;

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
     * @param object $notifiable
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        $channels = ['mail'];

        $phoneNumber = method_exists($notifiable, 'routeNotificationForTwilio')
            ? $notifiable->routeNotificationForTwilio()
            : ($notifiable->phone ?? null);

        if (!empty($phoneNumber)) {
            $channels[] = TwilioChannel::class;
            $channels[] = SmsLogChannel::class;
        }

        return $channels;
    }

    /**
     * Generate a 30-day signed payment link for public renter access.
     *
     * @return string
     */
    protected function getSignedPaymentUrl(): string
    {
        return URL::temporarySignedRoute(
            'invoices.public-show',
            now()->addDays(30),
            ['invoice' => $this->invoice->id]
        );
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param object $notifiable
     * @return MailMessage
     */
    public function toMail(object $notifiable): MailMessage
    {
        $renterName = $this->invoice->lease?->renter?->first_name ?? 'Valued Renter';
        $roomNumber = $this->invoice->lease?->room?->room_number ?? 'N/A';
        $formattedAmount = number_format($this->invoice->amount, 2);
        $dueDate = $this->invoice->due_date ? $this->invoice->due_date->format('F j, Y') : 'Due on receipt';
        $paymentUrl = $this->getSignedPaymentUrl();

        return (new MailMessage)
            ->subject("New Invoice #{$this->invoice->id} for Room {$roomNumber}")
            ->greeting("Hello {$renterName},")
            ->line("Your monthly rent invoice for Room {$roomNumber} has been generated.")
            ->line("Amount Due: ₱{$formattedAmount}")
            ->line("Due Date: {$dueDate}")
            ->action('View & Pay Invoice Online', $paymentUrl)
            ->line('Thank you for choosing RoomsForRent!');
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
        $paymentUrl = $this->getSignedPaymentUrl();

        return (new TwilioSmsMessage)
            ->content("RoomsForRent: New invoice #{$this->invoice->id} for Room {$roomNumber} (₱{$formattedAmount}) is now available. Pay online: {$paymentUrl}");
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
        $paymentUrl = $this->getSignedPaymentUrl();

        return "RoomsForRent: New invoice #{$this->invoice->id} for Room {$roomNumber} (₱{$formattedAmount}) is now available. Pay online: {$paymentUrl}";
    }
}
