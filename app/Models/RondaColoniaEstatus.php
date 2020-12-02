<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RondaColoniaEstatus extends Model
{
    use SoftDeletes;
    protected $table = 'rondas_colonias_estatus';
    protected $fillable = ['id','ronda_id','colonia_id','fecha_termino'];
    
    public function ronda(){
        return $this->belongsTo('App\Models\Ronda','ronda_id');
    }

    public function colonia(){
        return $this->belongsTo('App\Models\Colonia','colonia_id');
    }
}
