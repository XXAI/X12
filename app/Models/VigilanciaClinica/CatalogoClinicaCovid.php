<?php

namespace App\Models\VigilanciaClinica;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CatalogoClinicaCovid extends Model
{
    use SoftDeletes;
    protected $table = 'catalogo_clinica_covid';
    protected $fillable = [
        'id',
        'nombre_unidad',
        'camas_disponibles',
        'ventilador',
        'monitor',
        'bomba_infusion',
    ];
 

    public function CamasOcupadas(){
        return $this->hasMany('App\Models\VigilanciaClinica\Vigilancia','clinica_id','id')
                        ->where("estatus_egreso_id", "=", 1);
    }
}
