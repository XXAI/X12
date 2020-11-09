<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ronda extends Model
{
    use SoftDeletes;
    protected $table = 'rondas';
    protected $fillable = ['id','brigada_od','no_ronda','fecha_inicio','fecha_fin'];

    public function registros(){
        return $this->hasMany('App\Models\RondaRegistro','ronda_id');
    }
}
