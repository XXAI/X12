<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RondaRegistro extends Model
{
    use SoftDeletes;
    protected $table = 'rondas_registros';
    protected $fillable = ['id','ronda_id','fecha_registro','cabecera_recorrida_id','colonia_visitada_id','poblacion_beneficiada','casas_visitadas','casas_ausentes','casas_renuentes','casos_sospechosos_identificados','porcentaje_transmision','tratamientos_otorgados_brigadeo','tratamientos_otorgados_casos_positivos'];
    
    public function ronda(){
        return $this->belongsTo('App\Models\Ronda','ronda_id');
    }

    public function cabeceraRecorrida(){
        return $this->belongsTo('App\Models\Municipio','cabecera_recorrida_id');
    }

    public function coloniaVisitada(){
        return $this->belongsTo('App\Models\Colonia','colonia_visitada_id');
    }
}
