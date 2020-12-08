<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RondaRegionEstatus extends Model
{
    use SoftDeletes;
    protected $table = 'rondas_regiones_estatus';
    protected $fillable = ['id','ronda_id','municipio_id','region','fecha_termino'];
    
    public function ronda(){
        return $this->belongsTo('App\Models\Ronda','ronda_id');
    }

    public function municipio(){
        return $this->belongsTo('App\Models\Municipio','municipio_id');
    }
}

