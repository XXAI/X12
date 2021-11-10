<?php

namespace App\Models\Influenza;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GrupoPoblacion extends Model
{
    use SoftDeletes;
    protected $table = 'influenza_cat_grupos_problacion';
    protected $fillable = ['clave','descripcion'];
}