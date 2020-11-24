<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use DB;

class GrupoEdad extends Model{
    use SoftDeletes;
    protected $table = 'catalogo_grupos_edades';
    protected $fillable = ['id','edad_minima','edad_maxima'];
}
