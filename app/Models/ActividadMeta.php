<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ActividadMeta extends Model
{
    use SoftDeletes;
    protected $table = 'actividades_metas';
    protected $fillable = ['id','actividad_id','distrito_id','municipio_id','localidad_id','meta_programada'];

    public function metasUsuarios(){
        return $this->hasMany('App\Models\ActividadMetaUsuario','actividad_meta_id','id');
    }

    public function distrito(){
        return $this->belongsTo('App\Models\CasosCovid\Distrito','distrito_id');
    }

    public function municipio(){
        return $this->belongsTo('App\Models\Municipio','municipio_id');
    }

    public function localidad(){
        return $this->belongsTo('App\Models\Localidad','localidad_id');
    }
}