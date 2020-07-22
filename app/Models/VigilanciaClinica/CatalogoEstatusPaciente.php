<?php

namespace App\Models\VigilanciaClinica;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CatalogoEstatusPaciente extends Model
{
    use SoftDeletes;
    protected $table = 'catalogo_estatus_paciente';
}
