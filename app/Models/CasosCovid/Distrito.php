<?php

namespace App\Models\CasosCovid;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Distrito extends Model
{
    use SoftDeletes;
    protected $table = 'catalogo_distritos';
    protected $fillable = ['id','descripcion'];
}
