<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ConcentradoActividadBrigada extends Model
{
    use SoftDeletes;
    protected $table = 'concentrado_actividades_brigadas';
    protected $fillable = ['id','brigada_id','distrito_id','municipio_id','localidad_id','colonia_id','fecha','localidad_terminada','no_brigadas','total_personas_brigadas','total_brigadistas','casas_visitadas','casas_promocionadas','casas_encuestadas','casas_deshabitadas','casas_ausentes','casas_renuentes','pacientes_referidos_validacion','pacientes_referidos_hospitalizacion','pacientes_candidatos_toma_muestra','nombre_responsable_llenado'];

    public function detalles(){
        return $this->hasMany('App\Models\ConcentradoActividadBrigadaDetalle','concentrado_actividad_brigada_id');
    }

    public function distrito(){
        return $this->belongsTo('App\Models\Distrito','distrito_id');
    }

    public function colonia(){
        return $this->belongsTo('App\Models\Colonia','colonia_id');
    }

    public function localidad(){
        return $this->belongsTo('App\Models\Localidad','localidad_id');
    }

    public function municipio(){
        return $this->belongsTo('App\Models\Municipio','municipio_id');
    }

    public function brigada(){
        return $this->belongsTo('App\Models\Brigada','brigada_id');
    }
}