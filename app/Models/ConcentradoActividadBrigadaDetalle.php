<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ConcentradoActividadBrigadaDetalle extends Model
{
    use SoftDeletes;
    protected $table = 'concentrado_actividades_brigadas_detalles';
    protected $fillable = ['id','concentrado_actividad_brigada_id','grupo_edad_id','total_masculino','total_femenino','infeccion_respiratoria_m','infeccion_respiratoria_f','covid_m','covid_f','tratamientos_otorgados'];
    
    public function grupoEdad(){
        return $this->belongsTo('App\Models\GrupoEdad','grupo_edad_id');
    }
}
