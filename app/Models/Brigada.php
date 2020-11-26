<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Brigada extends Model
{
    use SoftDeletes;
    protected $table = 'brigadas';
    protected $fillable = ['id','grupo_estrategico_id','distrito_id','nombre_responsable_brigadas','telefono_responsable_brigadas','email_responsable_brigadas','total_brigadistas'];

    public function rondas(){
        return $this->hasMany('App\Models\Ronda','brigada_id');
    }

    public function grupoEstrategico(){
        return $this->belongsTo('App\Models\GrupoEstrategico','grupo_estrategico_id');
    }

    public function distrito(){
        return $this->belongsTo('App\Models\Distrito','distrito_id');
    }
}
