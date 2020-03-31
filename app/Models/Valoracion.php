<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Valoracion extends Model
{
    use SoftDeletes;
    protected $table = 'catalogo_valoracion';
    protected $fillable = ['id','clave','descripcion'];

}