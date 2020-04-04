<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CategoriaLlamada extends Model
{
    use SoftDeletes;
    protected $table = 'catalogo_categoria_llamada';
    protected $fillable = ['id','clasificacion','categoria','descripcion'];

}
