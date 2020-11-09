<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RondaRegistro extends Model
{
    use SoftDeletes;
    protected $table = 'rondas_registros';
    protected $fillable = ['id','ronda_id','fecha_registro','cabeceras_recorridas','colonias_visitadas','poblacion_beneficiada','casas_visitadas','casas_ausentes','casas_renuentes','casos_sospechosos_identificados','porcentaje_transmision','tratamientos_otorgados_brigadeo','tratamientos_otorgados_casos_positivos'];
    
    public function ronda(){
        return $this->belongsTo('App\Models\Ronda','ronda_id','id');
    }
}
