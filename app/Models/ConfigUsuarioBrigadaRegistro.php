<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ConfigUsuarioBrigadaRegistro extends Model
{
    use SoftDeletes;
    protected $table = 'config_usuarios_brigadas_registros';
    protected $fillable = ['id','usuario_id','distrito_id','municipio_id','zona','region'];
}
