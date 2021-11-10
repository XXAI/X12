<?php

namespace App\Models\Influenza;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DosisAvanceDiarioDetalle extends Model
{
    use SoftDeletes;
    protected $table = 'influenza_dosis_avance_diario_detalle';
    protected $fillable = ['avance_diario_id','dosis_meta_id','avance','observaciones'];

    public function dosisMeta(){
        return $this->belongsTo('App\Models\Influenza\DosisMeta','dosis_meta_id');
    }
}