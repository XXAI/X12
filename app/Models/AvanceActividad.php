<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AvanceActividad extends Model
{
    use SoftDeletes;
    protected $table = 'avances_actividades';
    protected $fillable = ['id','estrategia_id','actividad_id','actividad_meta_id','grupo_estrategico_id','avance','observaciones','fecha_avance','user_id','avance_padre_id'];

    public function usuario(){
        return $this->belongsTo('App\Models\User','user_id');
    }

    public function avancesHijos(){
        return $this->hasMany('App\Models\AvanceActividad','avance_padre_id','id');
    }
}

