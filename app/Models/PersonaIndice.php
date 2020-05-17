<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PersonaIndice extends Model
{
    use SoftDeletes;
    protected $table = 'persona_indice';
    protected $fillable = ['id','dispositivo_id','nombre','apellido_paterno','apellido_materno','alias', 'edad', 'sexo', 'estatus_covid_id', 'fecha_alta_14', 'fecha_alta_21' , 'fecha_nacimiento','email','telefono_casa','telefono_celular','estado_id','municipio_id','municipio','localidad_id','localidad','colonia','calle','no_exterior','no_interior','referencia','latitud','longitud','categorias', 'no_caso', 'codigo_postal', 'observaciones', 'fecha_alta_probable', 'fecha_confirmacion', 'fecha_inicio_sintoma', 'tipo_transmision_id', 'derechohabiente_id', 'tipo_atencion_id', 'tipo_unidad_id', 'responsable_id'];

    public function contactos(){
        return $this->hasMany('App\Models\PersonaContacto','persona_indice_id');
    }

    public function municipio(){
        return $this->belongsTo('App\Models\Municipio','municipio_id','id');
    }

    public function localidad(){
        return $this->belongsTo('App\Models\Localidad','localidad_id','id');
    }

    public function tipo_atencion(){

        return $this->belongsTo('App\Models\CasosCovid\TipoAtencion', 'tipo_atencion_id');
    }

    public function tipo_unidad(){

        return $this->belongsTo('App\Models\CasosCovid\TipoUnidad', 'tipo_unidad_id');
    }

    public function responsable(){

        return $this->belongsTo('App\Models\CasosCovid\Responsable', 'responsable_id');
    }

    public function estatus_covid(){

        return $this->belongsTo('App\Models\CasosCovid\EstatusCovid', 'estatus_covid_id');
    }

    
}
