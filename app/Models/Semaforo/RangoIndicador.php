<?php

namespace App\Models\Semaforo;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RangoIndicador extends Model
{
    //use SoftDeletes;
    protected $table = 'catalogo_rango_indicador';
    protected $fillable = [
        'id',
        'indicador_id',
        'rango',
        'valor',
    ];

 
    public function indicadores(){
        return $this->hasMany('App\Models\Semaforo\Indicador','id','indicador_id');
    }

}
