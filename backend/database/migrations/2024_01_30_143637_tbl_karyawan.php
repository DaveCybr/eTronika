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
        Schema::create('tbl_karyawan', function (Blueprint $table) {
            $table->id('id_karyawan');
            $table->string('nama_karyawan');
            $table->string('alamat');
            $table->string('nomor_telepon');
            $table->string('email');
            $table->string('jenis_kelamin');
            $table->string('status_karyawan');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_karyawan');
    }
};