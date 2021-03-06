<?php

namespace App\Models\CasosCovid;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TipoAtencion extends Model
{
    use SoftDeletes;
    protected $table = 'catalogo_tipos_atenciones';
    protected $fillable = ['id','descripcion'];
}
