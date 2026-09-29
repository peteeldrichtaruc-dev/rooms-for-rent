<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->cascadeOnDelete();
            $table->string('room_number');
            $table->unsignedInteger('capacity')->default(1);
            $table->decimal('price', 10, 2);
            $table->enum('status', ['available', 'occupied', 'maintenance'])->default('available');
            $table->text('description')->nullable();
            $table->timestamps();

            // Index for efficient multi-tenant filtering & room lookups
            $table->index(['property_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
