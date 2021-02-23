<?php

namespace App\Models\Semaforo;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Indicador extends Model
{
    use SoftDeletes;
    protected $table = 'catalogo_indicador';
    protected $fillable = [
        'id',
        'descripcion'
    ];
    public function Rangos(){
        return $this->hasMany('App\Models\Semaforo\RangoIndicador','indicador_id','id');
    }

    // public function pacientes(){
    //     return $this->hasMany('App\Models\VigilanciaClinica\Vigilancia','clinica_id','id')
    //                     ->where("estatus_egreso_id", "=", 1);
    // }
}
