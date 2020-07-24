<?php

namespace App\Models\VigilanciaClinica;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vigilancia extends Model
{
    use SoftDeletes;
    protected $table = 'vigilancia_clinica';
    protected $fillable = ['id', 'clinica_id', 'nombre_paciente', 'municipio_id', 'edad', 'sexo', 'fecha_inicio', 'fecha_ingreso', 'fecha_intubado', 'folio_pcr', 'no_caso', 'diagnostico', 'estatus_paciente_id', 'estatus_egreso_id', 'intubado', 'servicio_cama', 'pco_fipco', 'saturado_02', 'observaciones', 'ventilador', 'monitor', 'bomba_infusion'];

    public function municipio()
    {
        return $this->belongsTo('App\Models\Municipio', 'municipio_id');
    }

    public function estatus_paciente()
    {
        return $this->belongsTo('App\Models\VigilanciaClinica\CatalogoEstatusPaciente', 'estatus_paciente_id');
    }

    public function clinica_covid()
    {
        return $this->belongsTo('App\Models\VigilanciaClinica\CatalogoClinicaCovid', 'clinica_id');
    }

    public function estatus_egreso()
    {
        return $this->belongsTo('App\Models\CasosCovid\EgresosCovid', 'estatus_egreso_id');
    }
}
