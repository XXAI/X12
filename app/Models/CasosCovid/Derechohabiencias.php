<?php

namespace App\Models\CasosCovid;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Derechohabiencias extends Model
{
    use SoftDeletes;
    protected $table = 'catalogo_derechohabiencias';
    protected $fillable = ['id','descripcion'];
}
