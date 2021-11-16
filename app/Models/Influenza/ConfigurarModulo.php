<?php

namespace App\Models\Influenza;

use Illuminate\Database\Eloquent\Model;

class ConfigurarModulo extends Model
{
    protected $table = 'influenza_configuracion_modulo';
    protected $fillable = ['descripcion','llave','valor','tipo'];

    public function getValorAttribute($value){
        return $value;
    }
}