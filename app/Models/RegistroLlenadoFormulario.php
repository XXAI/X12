<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RegistroLlenadoFormulario extends Model
{
    use SoftDeletes;
    protected $table = 'registro_llenado_formularios';
    protected $fillable = ['id','formulario_id','persona_id','caso_id','finalizado','fecha_finalizado'];

    public function registroLlenadoRespuestas(){
        return $this->hasMany('App\Models\RegistroLlenadoRespuesta','registro_llenado_id');
    }
    
    public function formulario(){
        return $this->belongsTo('App\Models\Formulario','formulario_id');
    }

    public function persona(){
        return $this->belongsTo('App\Models\Persona','persona_id');
    }
}
