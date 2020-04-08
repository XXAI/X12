<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Persona extends Model
{
    use SoftDeletes;
    protected $table = 'personas';
    protected $fillable = ['id','nombre','apellido_paterno','apellido_materno','fecha_nacimiento','sexo','curp','email','telefono_casa','telefono_celular','estado_id','municipio_id','municipio','localidad_id','localidad','colonia','calle','no_exterior','no_interior','referencia','latitud','longitud','categorias'];

    public function callcenter(){
        return $this->hasOne('App\Models\LlamadaCallCenter','persona_id');
    }
}
