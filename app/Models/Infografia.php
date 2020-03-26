<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Infografia extends Model
{
    use SoftDeletes;
    protected $table = 'infografias';
    protected $fillable = ['id','tipo_infografia_id','descripcion','url'];
}
