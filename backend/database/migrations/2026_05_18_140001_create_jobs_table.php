<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('job_categories')->cascadeOnDelete();
            $table->string('title', 180);
            $table->string('company_name', 140);
            $table->string('short_description', 255);
            $table->text('description');
            $table->decimal('budget_min', 12, 2);
            $table->decimal('budget_max', 12, 2);
            $table->date('deadline');
            $table->string('expected_delivery_time', 60);
            $table->json('required_skills');
            $table->json('attachments')->nullable();
            $table->enum('status', ['open', 'closed'])->default('open');
            $table->timestamps();

            $table->index(['status', 'created_at']);
            $table->index('category_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jobs');
    }
};
