<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RegistroLlenadoRespuesta extends Model
{
    use SoftDeletes;
    protected $table = 'registro_llenado_respuestas';
    protected $fillable = ['id','registro_llenado_id','formulario_id','persona_id','pregunta_id','valor','respuesta_id','valor_respuesta','relevancia','peso'];

    public function registroLlenadoFormulario(){
        return $this->belongsTo('App\Models\RegistroLlenadoFormulario','registro_llenado_id');
    }

    public function formulario(){
        return $this->belongsTo('App\Models\Formulario','formulario_id');
    }

    public function persona(){
        return $this->belongsTo('App\Models\Persona','persona_id');
    }
    
    public function pregunta(){
        return $this->belongsTo('App\Models\Pregunta','pregunta_id');
    }

    public function respuesta(){
        return $this->belongsTo('App\Models\Respuesta','respuesta_id');
    }
}