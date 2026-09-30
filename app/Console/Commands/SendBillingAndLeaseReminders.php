<?php

namespace App\Console\Commands;

use App\Models\Invoice;
use App\Models\Lease;
use App\Models\User;
use App\Notifications\InvoiceOverdueNotification;
use App\Notifications\LeaseExpiringNotification;
use Illuminate\Console\Command;

class SendBillingAndLeaseReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reminders:send';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send overdue invoice alerts and 30-day lease expiration notices to tenants and landlords';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Processing billing and lease reminders...');

        // 1. Process and notify overdue invoices
        $overdueInvoices = Invoice::with(['lease.tenant', 'lease.room.property.user'])
            ->where('status', 'pending')
            ->where('due_date', '<', now()->startOfDay())
            ->get();

        foreach ($overdueInvoices as $invoice) {
            $invoice->update(['status' => 'overdue']);

            // Notify Tenant
            if ($invoice->lease?->tenant) {
                $invoice->lease->tenant->notify(new InvoiceOverdueNotification($invoice, 'tenant'));
            }

            // Notify Landlord (Property Owner)
            $landlord = $invoice->lease?->room?->property?->user ?? User::find($invoice->user_id);
            if ($landlord) {
                $landlord->notify(new InvoiceOverdueNotification($invoice, 'landlord'));
            }
        }

        $this->info("Updated and notified {$overdueInvoices->count()} overdue invoices.");

        // 2. Notify about leases expiring in 30 days
        $expiringLeases = Lease::with(['tenant', 'room.property.user'])
            ->where('status', 'active')
            ->whereDate('end_date', '=', now()->addDays(30)->toDateString())
            ->get();

        foreach ($expiringLeases as $lease) {
            // Notify Tenant
            if ($lease->tenant) {
                $lease->tenant->notify(new LeaseExpiringNotification($lease, 'tenant'));
            }

            // Notify Landlord
            $landlord = $lease->room?->property?->user;
            if ($landlord) {
                $landlord->notify(new LeaseExpiringNotification($lease, 'landlord'));
            }
        }

        $this->info("Notified {$expiringLeases->count()} expiring leases.");

        return Command::SUCCESS;
    }
}
