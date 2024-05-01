<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;


class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Menghapus data sebelumnya jika ada
        DB::table('users')->truncate();

        // Menyisipkan data dummy
        DB::table('users')->insert([
            'username' => 'admin_asd',
            'name' => 'Admin ASD',
            'email_verified_at' => now(),
            'password' => Hash::make('admin_asd'), // Menggunakan Hash untuk mengenkripsi password
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}