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

class InvoiceOverdueNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * @param Invoice $invoice
     * @param string $recipientType 'renter' or 'landlord'
     */
    public function __construct(
        public Invoice $invoice,
        public string  $recipientType = 'renter'
    ) {}

    /**
     * Determine delivery channels based on recipient type and available contact info.
     *
     * @param object $notifiable
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        $channels = ['mail'];

        // Dispatch local SMS log notification for renters with phone numbers
        if ($this->recipientType === 'renter') {
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
     * @param object $notifiable
     * @return MailMessage
     */
    public function toMail(object $notifiable): MailMessage
    {
        $roomNumber = $this->invoice->lease?->room?->room_number ?? 'N/A';
        $formattedAmount = number_format($this->invoice->amount, 2);
        $dueDate = $this->invoice->due_date ? $this->invoice->due_date->format('F j, Y') : 'N/A';

        if ($this->recipientType === 'landlord') {
            $renterName = $this->invoice->lease?->renter?->first_name
                ? "{$this->invoice->lease->renter->first_name} {$this->invoice->lease->renter->last_name}"
                : 'a renter';

            return (new MailMessage)
                ->subject("Overdue Payment Alert: Room {$roomNumber}")
                ->greeting("Hello {$notifiable->name},")
                ->line("Invoice #{$this->invoice->id} for Room {$roomNumber} (Renter: {$renterName}) is now marked as **OVERDUE**.")
                ->line("Amount Due: ₱{$formattedAmount}")
                ->line("Original Due Date: {$dueDate}")
                ->action('View Invoice Details', url("/invoices/{$this->invoice->id}"))
                ->line('Please review the invoice on your dashboard.');
        }

        // Renter Notification with Signed Payment URL
        $renterName = $this->invoice->lease?->renter?->first_name ?? 'Valued Renter';
        $paymentUrl = $this->getSignedPaymentUrl();

        return (new MailMessage)
            ->subject("OVERDUE NOTICE: Invoice #{$this->invoice->id} for Room {$roomNumber}")
            ->greeting("Hello {$renterName},")
            ->line("Your rent invoice for Room {$roomNumber} was due on **{$dueDate}** and is now overdue.")
            ->line("Outstanding Balance: ₱{$formattedAmount}")
            ->action('Pay Online Now', $paymentUrl)
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
        $paymentUrl = $this->getSignedPaymentUrl();

        return (new TwilioSmsMessage)
            ->content("RoomsForRent Alert: Rent invoice #{$this->invoice->id} for Room {$roomNumber} (₱{$formattedAmount}) is OVERDUE. Pay online: {$paymentUrl}");
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

        return "RoomsForRent Alert: Rent invoice #{$this->invoice->id} for Room {$roomNumber} (₱{$formattedAmount}) is OVERDUE. Pay online: {$paymentUrl}";
    }
}
