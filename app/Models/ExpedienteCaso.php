<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ExpedienteCaso extends Model
{
    use SoftDeletes;
    protected $table = 'expediente_casos';
    protected $fillable = ['id','caso_id','descripcion','fecha_atencion','estatus_clave','valoracion_clave','atendido_por'];

    public function caso(){
        return $this->belongsTo('App\Models\Caso','caso_id','id');
    }

    public function atendidoPor(){
        return $this->belongsTo('App\Models\User','atendido_por');
    }
}
