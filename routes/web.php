<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\LeaseController;
use App\Http\Controllers\TenantController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\StripeWebhookController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::post('/webhooks/stripe', [StripeWebhookController::class, 'handle']);

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    // Profile Management
    Route::get('profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Property
    Route::resource('properties', PropertyController::class);

    // Rooms
    Route::resource('rooms', RoomController::class);

    // Leases
    Route::resource('leases', LeaseController::class);

    // Tenants
    Route::resource('tenants', TenantController::class);
    Route::post('/tenants/send-reminders', [TenantController::class, 'sendBulkReminders'])
        ->middleware('throttle:notifications')
        ->name('tenants.send-reminders');

    // Invoices
    Route::resource('invoices', InvoiceController::class);
    Route::patch('invoices/{invoice}/mark-as-paid', [InvoiceController::class, 'markAsPaid'])
        ->name('invoices.mark-as-paid');
    Route::post('invoices/{invoice}/checkout', [InvoiceController::class, 'checkout'])
        ->name('invoices.checkout');
    Route::post('/invoices/generate-monthly', [InvoiceController::class, 'generateMonthly'])
        ->name('invoices.generate-monthly')
        ->middleware('throttle:billing-actions');
});

// Tenant Public Signed Routes (No Auth Required)
Route::middleware(['signed'])->group(function () {
    Route::get('/pay/{invoice}', [InvoiceController::class, 'publicShow'])
        ->name('invoices.public-show');
    Route::post('/pay/{invoice}/checkout', [InvoiceController::class, 'publicCheckout'])
        ->name('invoices.public-checkout');
});

Route::get('/checkout/success', [CheckoutController::class, 'success'])->name('checkout.success');
Route::get('/checkout/cancel', [CheckoutController::class, 'cancel'])->name('checkout.cancel');

require __DIR__ . '/auth.php';
