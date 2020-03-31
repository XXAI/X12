<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Estatus extends Model
{
    use SoftDeletes;
    protected $table = 'catalogo_estatus';
    protected $fillable = ['id','clave','descripcion'];

}
