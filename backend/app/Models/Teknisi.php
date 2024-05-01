<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teknisi extends Model
{
    use HasFactory;

    protected $table = 'tbl_tim_teknisi';
    protected $primaryKey = 'id_teknisi';
    protected $guarded = [];
}
