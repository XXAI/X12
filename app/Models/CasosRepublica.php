<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CasosRepublica extends Model
{
    use SoftDeletes;
    protected $table = 'casos_republica';

    public function estado(){
        return $this->belongsTo('App\Models\Estado','estado_id','id');
    }
}
