<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RondaRegistro extends Model
{
    use SoftDeletes;
    protected $table = 'rondas_registros';
    protected $fillable = ['id','ronda_id','no_brigada','zona','region','fecha_registro','cabecera_recorrida_id','localidad_id','colonia_visitada_id','casas_visitadas','casas_promocionadas','casas_encuestadas','casas_deshabitadas','casas_ausentes','casas_renuentes','pacientes_referidos_valoracion','pacientes_referidos_hospitalizacion','pacientes_candidatos_muestra_covid','creado_por','modificado_por','borrado_por'];
    
    public function ronda(){
        return $this->belongsTo('App\Models\Ronda','ronda_id');
    }

    public function detalles(){
        return $this->hasMany('App\Models\RondaRegistroDetalle','ronda_registro_id');
    }

    public function cabeceraRecorrida(){
        return $this->belongsTo('App\Models\Municipio','cabecera_recorrida_id');
    }

    public function localidad(){
        return $this->belongsTo('App\Models\Localidad','localidad_id');
    }

    public function coloniaVisitada(){
        return $this->belongsTo('App\Models\Colonia','colonia_visitada_id');
    }
}
