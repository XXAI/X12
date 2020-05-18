<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ArchivoGrupo extends Model
{
    use SoftDeletes;
    protected $table = 'archivos_grupos';
    protected $fillable = ['id','titulo','path','grupo_estrategico_id'];
    
    public function grupo(){
        return $this->belongsTo('App\Models\GrupoEstrategico','grupo_estrategico_id');
    }    
}
