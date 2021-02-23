<?php

namespace App\Models\Semaforo;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Semaforo extends Model
{
    use SoftDeletes;
    protected $table = 'semaforos';
    protected $fillable = [
        'id',
        'fecha_inicio',
        'fecha_fin',
        'rango_indicador_id',
        'valor',
        'resultado'
    ];

    public function rango_indicadores(){
        return $this->hasMany('App\Models\Semaforo\RangoIndicador','rango_indicador_id','id');
    }
 
}
