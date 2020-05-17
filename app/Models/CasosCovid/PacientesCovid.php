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
        'responsable_id',
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
        'fecha_alta_probable',
        'egreso_id',

    ];

    public function municipio(){

        return $this->belongsTo('App\Models\Municipio', 'municipio_id');
    }

    public function tipo_atencion(){

        return $this->belongsTo('App\Models\CasosCovid\TipoAtencion', 'tipo_atencion_id');
    }

    public function tipo_unidad(){

        return $this->belongsTo('App\Models\CasosCovid\TipoUnidad', 'tipo_unidad_id');
    }

    public function estatus_covid(){

        return $this->belongsTo('App\Models\CasosCovid\EstatusCovid', 'estatus_covid_id');
    }

    public function derechohabiencia(){

        return $this->belongsTo('App\Models\CasosCovid\Derechohabiencias', 'derechohabiente_id');
    }

    public function responsable(){

        return $this->belongsTo('App\Models\CasosCovid\Responsable', 'responsable_id');
    }

    public function tipo_transmision(){

        return $this->belongsTo('App\Models\CasosCovid\TiposTransmisiones', 'tipo_transmision_id');
    }


    public function egreso_covid(){

        return $this->belongsTo('App\Models\CasosCovid\EgresosCovid', 'egreso_id');
    }




}
