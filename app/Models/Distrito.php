<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Distrito extends Model
{
    use SoftDeletes;
    protected $table = 'catalogo_distritos';
    protected $fillable = ['id','descripcion'];

    public function municipios(){
        return $this->hasMany('App\Models\Municipio','municipio_id','id');
    }
}