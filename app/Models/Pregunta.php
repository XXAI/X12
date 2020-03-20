<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pregunta extends Model
{
    use SoftDeletes;
    protected $table = 'preguntas';
    protected $fillable = ['id','formulario_id','descripcion','tipo_pregunta_id','tipo_valor_id','obligatorio','peso','relevancia','relevancia_condicion','relevancia_valor','serie_id','visible','categorias'];

    public function serie(){
        return $this->belongsTo('App\Models\Serie','serie_id');
    }

    public function respuesta(){
        return $this->hasMany('App\Models\Respuesta','pregunta_id');
    }

    public function tipoPregunta(){
        return $this->belongsTo('App\Models\TipoPregunta','tipo_pregunta_id');
    }

    public function tipoValor(){
        return $this->belongsTo('App\Models\TipoValor','tipo_valor_id');
    }
}
