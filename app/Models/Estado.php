<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Estado extends Model
{
    use SoftDeletes;
    protected $table = 'catalogo_estados';
    protected $fillable = ['id','clave','descripcion'];

    public function municipios(){
        return $this->hasMany('App\Models\Municipio','estado_id','id');
    }

}
