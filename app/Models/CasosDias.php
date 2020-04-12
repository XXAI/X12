<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CasosDias extends Model
{
    use SoftDeletes;
    protected $table = 'casos_dias';
}
