<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ActividadMeta extends Model
{
    use SoftDeletes;
    protected $table = 'actividades_metas_usuarios';
    protected $fillable = ['id','actividad_meta_id','user_id','meta_programada'];
    
    public function usuario(){
        return $this->belongsTo('App\Models\User','user_id');
    }
}
