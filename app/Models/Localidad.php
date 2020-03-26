<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Localidad extends Model
{
    use SoftDeletes;
    protected $table = 'catalogo_localidades';
    protected $fillable = ['id','municipio_id','clave','clave_ofi','descripcion','coordenadas_google','indigenas','cruzada','p_total','longitud','latitud','altitud'];

    public function municipio(){
        return $this->belongsTo('App\Models\Municipio','municipio_id','id');
    }
}