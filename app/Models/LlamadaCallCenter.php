<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LlamadaCallCenter extends Model
{
    use SoftDeletes;
    protected $table = 'llamadas_call_center';
    protected $fillable = ['id','persona_id','formulario_id','nombre_llamada','direccion_llamada','telefono_llamada','folio','nombre_paciente','edad_paciente','sexo','fecha_llamada','hora_llamada','asunto','estatus_denuncia','unidad_aplicativa','distrito','categoria_llamada_id','seguimiento','recibio_llamada','turno_id','oficio_enviado_a'];
}