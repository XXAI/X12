<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RondaLocalidadEstatus extends Model
{
    use SoftDeletes;
    protected $table = 'rondas_localidades_estatus';
    protected $fillable = ['id','ronda_id','localidad_id','fecha_termino'];
    
    public function ronda(){
        return $this->belongsTo('App\Models\Ronda','ronda_id');
    }

    public function localidad(){
        return $this->belongsTo('App\Models\Localidad','localidad_id');
    }
}
