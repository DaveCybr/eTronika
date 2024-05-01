<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Barang;

class BarangSparepartSeeder extends Seeder
{
    /**
     * Run the seeder.
     */
    public function run(): void
    {
        // You can adjust the number of seed data as needed
        Barang::factory()->count(10)->create();
    }
}