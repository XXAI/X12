<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BitacoraCasoSospechoso extends Model
{
    use SoftDeletes;
    protected $table = 'bitacora_casos_sospechosos';
    
    protected $fillable = [
        'id',       
        'caso_id',
        'seguimiento',
        'user_id'
    ];

    public function caso(){
        return $this->belongsTo('App\Models\CasoSospechoso','caso_id','id');
    }
    
}
