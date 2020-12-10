<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BrigadaDistribucionRegion extends Model
{
    use SoftDeletes;
    protected $table = 'brigadas_distribucion_regiones';
    protected $fillable = ['id','distrito_id','municipio_id','localidad_id','grupo','zona','region','nombre_encargado'];

    public function distrito(){
        return $this->belongsTo('App\Models\Distrito','distrito_id');
    }

    public function municipio(){
        return $this->belongsTo('App\Models\Municipio','municipio_id');
    }

    public function localidad(){
        return $this->belongsTo('App\Models\Localidad','localidad_id');
    }
}