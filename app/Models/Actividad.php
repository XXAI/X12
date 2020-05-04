<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

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
}
