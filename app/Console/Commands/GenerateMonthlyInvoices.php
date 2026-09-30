<?php

namespace App\Console\Commands;

use App\Models\Invoice;
use App\Models\Lease;
use App\Notifications\InvoiceGeneratedNotification;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class GenerateMonthlyInvoices extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'invoices:generate-monthly';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate monthly rent invoices for all active leases due this month';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Starting monthly invoice generation...');

        $startOfMonth = now()->startOfMonth();
        $endOfMonth = now()->endOfMonth();

        // Eager load room.property to retrieve user_id (landlord)
        $activeLeases = Lease::with('room.property')
            ->where('status', 'active')
            ->get();

        $generatedCount = 0;

        foreach ($activeLeases as $lease) {
            $landlordId = $lease->room?->property?->user_id;

            if (!$landlordId) {
                $this->warn("Skipping Lease #{$lease->id}: No associated property user_id found.");
                continue;
            }

            // Check if an invoice was already generated for this lease in the current month
            $existingInvoice = Invoice::where('lease_id', $lease->id)
                ->whereBetween('due_date', [$startOfMonth, $endOfMonth])
                ->exists();

            if (!$existingInvoice) {
                $invoiceNumber = 'INV-' . strtoupper(Str::random(8));

                $invoice = Invoice::create([
                    'user_id' => $landlordId,
                    'lease_id' => $lease->id,
                    'invoice_number' => $invoiceNumber,
                    'amount' => $lease->rent_amount,
                    'due_date' => now()->startOfMonth()->addDays(4), // Due on the 5th of the month
                    'status' => 'pending',
                    'description' => 'Auto generated invoice #' . $invoiceNumber,
                ]);

                if ($lease->tenant) {
                    $lease->tenant->notify(new InvoiceGeneratedNotification($invoice));
                }

                $generatedCount++;
            }
        }

        $this->info("Successfully generated {$generatedCount} invoices.");

        return Command::SUCCESS;
    }
}
