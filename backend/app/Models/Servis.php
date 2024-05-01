<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Servis extends Model
{
    use HasFactory;

    protected $table = 'tbl_servis';
    protected $primaryKey = 'id_servis';
    protected $guarded = [];
}
