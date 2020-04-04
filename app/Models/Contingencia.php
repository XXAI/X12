<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Contingencia extends Model
{
    use SoftDeletes;
    protected $table = 'contingencias';
    protected $fillable = ['id','titulo','descripcion','image_file'];

    public function casos(){
        return $this->hasMany('App\Models\Caso','contingencia_id','id');
    }
    
    public function formularios(){
        return $this->hasMany('App\Models\Formulario','contingencia_id','id');
    }
}
