<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GrupoEstrategico extends Model
{
    use SoftDeletes;
    protected $table = 'grupos_estrategicos';
    protected $fillable = ['folio','descripcion'];

    public function usuarios(){
        return $this->belongsToMany('App\Models\User','grupos_estrategicos_usuarios','grupo_estrategico_id','user_id');
    }
}
