<?php

namespace App\Models\Influenza;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DosisMeta extends Model
{
    use SoftDeletes;
    protected $table = 'influenza_dosis_metas';
    protected $fillable = ['distrito_id','grupo_poblacion_id','meta_general','meta_diaria','avance_dosis_acumuladas'];

    public function distrito(){
        return $this->belongsTo('App\Models\Distrito','distrito_id');
    }

    public function grupoPoblacion(){
        return $this->belongsTo('App\Models\Influenza\GrupoPoblacion','grupo_poblacion_id');
    }

    public function avanceDiario(){
        return $this->hasMany('App\Models\Influenza\DosisAvanceDiarioDetalle','dosis_meta_id');
    }
}