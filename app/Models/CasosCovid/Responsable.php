<?php

namespace App\Models\CasosCovid;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Responsable extends Model
{
    use SoftDeletes;
    protected $table = 'catalogo_responsables';
    protected $fillable = ['id','descripcion'];
}
