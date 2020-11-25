<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RondaRegistroDetalle extends Model
{
    use SoftDeletes;
    protected $table = 'rondas_registros_detalles';
    protected $fillable = ['id','ronda_registro_id','grupo_edad_id','total_masculino','total_femenino','infeccion_respiratoria_m','infeccion_respiratoria_f','covid_m','covid_f','tratamientos_otorgados'];
    
    public function grupoEdad(){
        return $this->belongsTo('App\Models\GrupoEdad','grupo_edad_id');
    }
}
