<?php

namespace App\Broadcasting;

use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class SmsLogChannel
{
    /**
     * Send the given notification via SMS Log.
     *
     * @param object $notifiable
     * @param Notification $notification
     * @return void
     */
    public function send(object $notifiable, Notification $notification): void
    {
        if (!method_exists($notification, 'toSms')) {
            return;
        }

        $message = $notification->toSms($notifiable);
        $to = method_exists($notifiable, 'routeNotificationForTwilio')
            ? $notifiable->routeNotificationForTwilio()
            : ($notifiable->phone ?? 'Unknown Number');

        Log::channel('sms')->info("--- MOCK SMS DISPATCHED ---");
        Log::channel('sms')->info("TO: {$to}");
        Log::channel('sms')->info("MESSAGE: {$message}");
        Log::channel('sms')->info("---------------------------");
    }
}
