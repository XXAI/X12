<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TipoPregunta extends Model
{
    use SoftDeletes;
    protected $table = 'catalogo_tipos_preguntas';
    protected $fillable = ['id','llave','descripcion'];

}
