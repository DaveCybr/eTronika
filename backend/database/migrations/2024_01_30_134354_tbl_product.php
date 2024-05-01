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
        Schema::create('tbl_product', function (Blueprint $table) {
            $table->id('id_product');
            $table->string('nama');
            $table->string('seri');
            $table->string('foto');
            $table->string('harga');
            $table->string('stok');
            $table->string('id_merk');
            $table->string('deskripsi');
            $table->string('id_supplier');
            $table->string('id_kategori');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_product');
    }
};