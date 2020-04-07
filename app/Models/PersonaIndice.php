<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PersonaIndice extends Model
{
    use SoftDeletes;
    protected $table = 'persona_indice';
    protected $fillable = ['id','nombre','apellido_paterno','apellido_materno','fecha_nacimiento','email','telefono_casa','telefono_celular','estado_id','municipio_id','municipio','localidad_id','localidad','colonia','calle','no_exterior','no_interior','referencia','latitud','longitud','categorias', 'no_caso', 'codigo_postal'];

    public function contactos(){
        return $this->hasMany('App\Models\PersonaContacto','persona_indice_id');
    }

    public function municipio(){
        return $this->belongsTo('App\Models\Municipio','municipio_id','id');
    }

    public function localidad(){
        return $this->belongsTo('App\Models\Localidad','localidad_id','id');
    }
}
