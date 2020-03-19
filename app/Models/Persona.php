<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Persona extends Model
{
    use SoftDeletes;
    protected $table = 'personas';
    protected $fillable = ['id','nombre','apellido_paterno','apellido_materno','fecha_nacimiento','curp','email','telefono_casa','telefono_celular','latitud','longitud','categorias'];
}
