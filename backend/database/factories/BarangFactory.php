<?php

namespace Database\Factories;

use App\Models\Barang;
use Illuminate\Database\Eloquent\Factories\Factory;

class BarangFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Barang::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'nama' => $this->faker->name,
            'nomor_seri' => $this->faker->unique()->ean13,
            'merk' => $this->faker->word,
            'foto' => $this->faker->imageUrl(),
            'harga' => $this->faker->randomNumber(4),
            'stok' => $this->faker->randomNumber(2),
            'deskripsi' => $this->faker->paragraph,
            'id_supplier' => $this->faker->randomNumber(2),
            'id_kategori' => $this->faker->randomNumber(2),
            'created_at' => $this->faker->dateTime(),
            'updated_at' => $this->faker->dateTime(),
        ];
    }
}