<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Serie extends Model
{
    use SoftDeletes;
    protected $table = 'series';
    protected $fillable = ['id','valor_activar','condicion_activar'];

    public function preguntas(){
        return $this->belongsToMany('App\Models\Pregunta','preguntas_series','serie_id','pregunta_id');
    }
}
