<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Persona extends Model
{
    use SoftDeletes;
    protected $table = 'personas';
    protected $fillable = ['id','nombre','apellido_paterno','apellido_materno','fecha_nacimiento','sexo','curp','email','telefono_casa','telefono_celular','estado_id','municipio_id','municipio','localidad_id','localidad','colonia','calle','no_exterior','no_interior','codigo_postal','referencia','latitud','longitud','categorias'];

    public function municipioData(){
        return $this->belongsTo('App\Models\Municipio','municipio_id','id');
    }

    public function localidadData(){
        return $this->belongsTo('App\Models\Localidad','localidad_id','id');
    }
}
