<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TipoValor extends Model
{
    use SoftDeletes;
    protected $table = 'catalogo_tipos_valores';
    protected $fillable = ['id','llave','descripcion'];

}
