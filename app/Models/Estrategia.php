<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Estrategia extends Model
{
    use SoftDeletes;
    protected $table = 'estrategias';
    protected $fillable = ['id','nombre','activo'];

    public function actividades(){
        return $this->hasMany('App\Models\Actividad','estrategia_id','id');
    }

}
