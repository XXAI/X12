<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use DB;

class GrupoEstrategico extends Model
{
    use SoftDeletes;
    protected $table = 'grupos_estrategicos';
    protected $fillable = ['id','descripcion'];
}
