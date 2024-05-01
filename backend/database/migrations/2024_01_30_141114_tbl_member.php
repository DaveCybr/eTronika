<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_member', function (Blueprint $table) {
            $table->id('id_member');
            $table->string('nama_member');
            $table->string('alamat');
            $table->string('nomor_telepon');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_member');
    }
};