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
        Schema::create('tbl_unit_terdaftar', function (Blueprint $table) {
            $table->id('id_unit_terdaftar');
            $table->string('id_member');
            $table->string('unique_seri');
            $table->string('nama_unit');
            $table->string('id_garansi');
            $table->string('tanggal_berakhir_garansi');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_unit_terdaftar');
    }
};
