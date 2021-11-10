<?php

namespace App\Models\Influenza;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DosisAvanceDiario extends Model
{
    use SoftDeletes;
    protected $table = 'influenza_dosis_avance_diario';
    protected $fillable = ['distrito_id','fecha_avance','avance_dia','avance_acumulado','observaciones','solo_lectura','usuario_id','creado_por'];

    public function detalles(){
        return $this->hasMany('App\Models\Influenza\DosisAvanceDiarioDetalle','avance_diario_id');
    }

    public function distrito(){
        return $this->belongsTo('App\Models\Distrito','distrito_id');
    }

    public function usuario(){
        return $this->belongsTo('App\Models\User','usuario_id');
    }

    public function creadoPor(){
        return $this->belongsTo('App\Models\User','creado_por');
    }
}