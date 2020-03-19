<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Formulario extends Model
{
    use SoftDeletes;
    protected $table = 'formularios';
    protected $fillable = ['id','peso','descripcion','categorias','activo','creado_por','ultima_edicion_por'];

    public function preguntas(){
        return $this->hasMany('App\Models\Pregunta','formulario_id','id');
    }

    public function creadoPor(){
        return $this->belongsTo('App\Models\User','creado_por');
    }

    public function ultimaEdicionPor(){
        return $this->belongsTo('App\Models\User','ultima_edicion_por');
    }
    
}
