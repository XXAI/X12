<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ronda extends Model
{
    use SoftDeletes;
    protected $table = 'rondas';
    protected $fillable = ['id','brigada_id','municipio_id','no_ronda','fecha_inicio','fecha_fin'];

    public function registros(){
        return $this->hasMany('App\Models\RondaRegistro','ronda_id');
    }

    public function municipio(){
        return $this->belongsTo('App\Models\Municipio','municipio_id');
    }

    public function brigada(){
        return $this->belongsTo('App\Models\Brigada','brigada_id');
    }
}
