<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PersonaContacto extends Model
{
    use SoftDeletes;
    protected $table = 'persona_contacto';
    protected $fillable = ['nombre', 'alias', 'observacion', 'persona_indice_id', "apellido_paterno", "apellido_materno", "alias", "fecha_nacimiento", "email", "telefono_casa", "telefono_celular", "estado_id", "municipio_id", "municipio", "localidad_id", "localidad", "colonia", "calle", "no_exterior", "no_interior", "codigo_postal", "referencia", "latitud", "longitud", "observaciones", "estatus_contacto_id", "persona_nuevo_indice_id", "estatus_salud_id", "estatus_sistomatologia_id", "no_caso", "tipo_contacto_id"];

    public function municipio(){
        return $this->belongsTo('App\Models\Municipio','municipio_id','id');
    }

    public function localidad(){
        return $this->belongsTo('App\Models\Localidad','localidad_id','id');
    }
}
