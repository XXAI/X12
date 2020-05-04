<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ActividadMetaGrupo extends Model
{
    use SoftDeletes;
    protected $table = 'actividades_metas_grupos';
    protected $fillable = ['id','actividad_id','actividad_meta_id','grupo_estrategico_id','meta_programada'];
    
}
