<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CasoSospechoso extends Model
{
    use SoftDeletes;
    protected $table = 'casos_sospechosos';
    /*
    protected $fillable = ['id','persona_id','contingencia_id','fecha_deteccion','es_indice','caso_padre_id','nivel','estatus_clave','valoracion_clave','latitud','longitud','observaciones','capturado_por'];

    public function expediente(){
        return $this->hasMany('App\Models\ExpedienteCaso','caso_id','id');
    }

    public function contingencia(){
        return $this->belongsTo('App\Models\Contingencia','contingencia_id','id');
    }

    public function casosHijos(){
        return $this->hasMany('App\Models\Caso','caso_padre_id','id');
    }

    public function persona(){
        return $this->belongsTo('App\Models\Persona','persona_id','id');
    }

    public function capturadoPor(){
        return $this->belongsTo('App\Models\User','capturado_por');
    }*/
    
}
