<?php

namespace App\Models\CasosCovid;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EgresosCovid extends Model
{
    use SoftDeletes;
    protected $table = 'catalogo_egresos';
    protected $fillable = ['id','descripcion'];
}
