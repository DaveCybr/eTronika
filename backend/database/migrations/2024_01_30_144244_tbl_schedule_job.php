<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tbl_schedule_job', function (Blueprint $table) {
            $table->id('id_job');
            $table->string('id_tim_teknisi');
            $table->string('id_unit_terdaftar');
            $table->string('deskripsi_servis');
            $table->string('tanggal_waktu');
            $table->string('foto_dok');
            $table->string('status_job');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_schedule_job');
    }
};
