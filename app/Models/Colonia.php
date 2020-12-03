<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Colonia extends Model
{
    use SoftDeletes;
    protected $table = 'catalogo_colonias';
    protected $fillable = ['id','distrito_id','municipio_id','localidad_id','zona','region','nombre','usuario_captura_id'];

    public function municipio(){
        return $this->belongsTo('App\Models\Municipio','municipio_id');
    }

    public function localidad(){
        return $this->belongsTo('App\Models\Localidad','localidad_id');
    }
    
    public function distrito(){
        return $this->belongsTo('App\Models\Distrito','distrito_id');
    }

    public function usuario(){
        return $this->belongsTo('App\Models\User','usuario_captura_id');
    }
}