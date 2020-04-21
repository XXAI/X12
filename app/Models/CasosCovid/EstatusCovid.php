<?php

namespace App\Models\CasosCovid;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EstatusCovid extends Model
{
    use SoftDeletes;
    protected $table = 'catalogo_estatus_covid';
    protected $fillable = ['id','descripcion'];
}
