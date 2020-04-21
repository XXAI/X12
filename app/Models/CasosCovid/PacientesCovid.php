<?php

namespace App\Models\CasosCovid;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PacientesCovid extends Model
{
    use SoftDeletes;
    protected $table = 'pacientes_covid';
    protected $fillable = [
        'id',
        'no_caso',
        'nombre',
        'sexo',
        'edad',
        'municipio_id',
        'responsable',
        'fecha_captura',
        'tipo_atencion_id',
        'tipo_unidad_id',
        'estatus_covid_id',
        'derechohabiente_id',
        'distrito_id',
        'contactos',
        'tipo_transmision_id',
        'fecha_inicio_sintoma',
        'fecha_confirmacion',
        'fecha_alta_14',
        'fecha_alta_21',
        'dias_evolucion',
        'fecha_alta_probable'
    ];


}
