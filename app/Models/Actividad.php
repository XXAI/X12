<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use DB;

class Actividad extends Model
{
    use SoftDeletes;
    protected $table = 'actividades';
    protected $fillable = ['id','estrategia_id','descripcion','total_meta_programada'];

    public function metas(){
        return $this->hasMany('App\Models\ActividadMeta','actividad_id','id');
    }

    public function estrategia(){
        return $this->belongsTo('App\Models\Estrategia','estrategia_id');
    }
    
    public function metasGrupos(){
        return $this->hasMany('App\Models\ActividadMetaGrupo','actividad_id','id')->whereNull('actividad_meta_id');
    }

    public function avances(){
        return $this->hasMany('App\Models\AvanceActividad','actividad_id','id');
    }

    public function avanceAcumulado(){
        return $this->hasOne('App\Models\AvanceActividad','actividad_id','id')
                    ->select('actividad_id','grupo_estrategico_id',DB::raw('SUM(avance) as total_avance'),DB::raw('MAX(fecha_avance) as ultima_fecha_avance'),DB::raw('DATEDIFF(current_date(),MAX(fecha_avance)) as dias_ultimo_avance'))
                    ->whereNull('actividad_meta_id')
                    ->groupBy('actividad_id')
                    ->whereNull('deleted_at');
    }
}
