<?php

namespace App\Models\CasosCovid;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TipoUnidad extends Model
{
    use SoftDeletes;
    protected $table = 'catalogo_tipos_unidades';
    protected $fillable = ['id','descripcion'];
}
