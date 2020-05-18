<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VariableGlobal extends Model
{
    use SoftDeletes;
    protected $table = 'variables_globales';
    protected $fillable = ['id','nombre','valor','user_id'];

    public function usuario(){
        return $this->belongsTo('App\Models\User','user_id');
    }
}
