<?php

namespace App\Models\CasosCovid;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TiposTransmisiones extends Model
{
    use SoftDeletes;
    protected $table = 'catalogo_tipos_transmisiones';
    protected $fillable = ['id','descripcion'];
}
