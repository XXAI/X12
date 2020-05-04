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

    public function avances(){
        return $this->hasMany('App\Models\AvanceActividad','actividad_id','id');
    }

    public function avanceAcumulado(){
        return $this->hasOne('App\Models\AvanceActividad','actividad_id','id')->select('actividad_id',DB::raw('SUM(avance) as total_avance'),DB::raw('MAX(fecha_avance) as ultima_fecha_avance'))->groupBy('actividad_id')->whereNull('deleted_at');
    }
}