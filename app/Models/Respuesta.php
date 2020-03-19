<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Respuesta extends Model
{
    use SoftDeletes;
    protected $table = 'respuestas';
    protected $fillable = ['id','pregunta_id','descripcion','valor'];
}
