<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Municipio extends Model
{
    use SoftDeletes;
    protected $table = 'catalogo_municipios';
    protected $fillable = ['id','estado_id','clave','descripcion'];

    public function localidades(){
        return $this->hasMany('App\Models\Municipio','municipio_id','id');
    }

    public function estado(){
        return $this->belongsTo('App\Models\Estado','estado_id','id');
    }

    public function distrito(){
        return $this->belongsTo('App\Models\CasosCovid\Distrito','distrito_id','id');
    }
}