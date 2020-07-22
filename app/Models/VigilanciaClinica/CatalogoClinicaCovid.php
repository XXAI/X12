<?php

namespace App\Models\VigilanciaClinica;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CatalogoClinicaCovid extends Model
{
    use SoftDeletes;
    protected $table = 'catalogo_clinica_covid';
}
