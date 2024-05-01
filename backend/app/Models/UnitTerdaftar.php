<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UnitTerdaftar extends Model
{
    use HasFactory;
    protected $table = 'tbl_unit_terdaftar';
    protected $primaryKey = 'id_unit_terdaftar';
    protected $fillable = [
        'id_member',
        'unique_seri',
        'nama_unit',
        'id_garansi',
        'tanggal_berakhir_garansi'
    ];
    public $timestamps = true;
}
