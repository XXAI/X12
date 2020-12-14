<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CasoSospechoso extends Model
{
    use SoftDeletes;
    protected $table = 'casos_sospechosos';
    
    protected $fillable = [
        'id',
        'folio',
        'folio_incremento',
        'fecha_identificacion',        
        'origen_id',
        'tipo_paciente_id',
        'apellido_paterno',
        'apellido_materno',
        'nombre',
        'sexo',
        'edad',
        'ocupacion',
        'esta_embarazada',
        'meses_embarazo',
        'municipio_id',
        'municipio_nombre',
        'localidad_id',
        'localidad_nombre',    
        'colonia_id',
        'colonia_nombre',
        'domicilio',
        'telefonos',
        'diabetes',
        'hipertension',
        'obesidad',
        'epoc',
        'asma',
        'inmunosupresion',
        'vih_sida',
        'enfermedad_cardiovascular',
        'insuficiencia_renal',
        'tabaquismo',

        'inicio_subito_sintomas',
        'fiebre',
        'tos',
        'cefalea',
        'disnea',
        'irritabilidad',
        'dolor_toracico',
        'escalofrios',
        'odinofagia',
        'mialgias',
        'artralgias',
        'anosmia',
        'disgeusia',
        'rinorrea',
        'conjuntivitis',
        'ataque_estado_general',
        'diarrea',
        'polipnea',
        'dolor_abdominal',
        'vomito',
        'cianosis',
        'fecha_inicio_sintomas',
        'fecha_termino_seguimiento', //sumar 14 dias de inicio de sintomas
        'tratamiento',
        'fecha_inicio_tratamiento',
        'fecha_termino_tratamiento',
        'causa_no_tratamiento',
        'tuvo_tratamiento_previo_para_covid',
        'tratamiento_previo_para_covid',
        'fecha_tratamiento_anterior',
        'quien_otorgo_tratamiento_anterior',
    
        'contactos_sintomaticos',
        'contactos_asintomaticos',
        'numero_contactos',  
    
        'condicion_egreso',
        'user_id'
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'esta_embarazada' => 'boolean',
        'tuvo_tratamiento_previo_para_covid' => 'boolean'
    ];

    public function bitacora(){
        return $this->hasMany('App\Models\BitacoraCasoSospechoso','caso_id','id');
    }
/*
    

    public function contingencia(){
        return $this->belongsTo('App\Models\Contingencia','contingencia_id','id');
    }

    public function casosHijos(){
        return $this->hasMany('App\Models\Caso','caso_padre_id','id');
    }

    public function persona(){
        return $this->belongsTo('App\Models\Persona','persona_id','id');
    }

    public function capturadoPor(){
        return $this->belongsTo('App\Models\User','capturado_por');
    }*/
    
}
