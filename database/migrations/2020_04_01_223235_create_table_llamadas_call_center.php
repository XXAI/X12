<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableLlamadasCallCenter extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('llamadas_call_center', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('persona_id')->unsigned()->nullable();
            $table->string('nombre_llamada')->nullable();
            $table->string('direccion_llamada')->nullable();
            $table->string('telefono_llamada',20)->nullable();

            $table->string('folio',5);
            
            $table->string('nombre_paciente')->nullable();
            $table->integer('edad_paciente')->nullable();
            $table->string('sexo',1)->nullable();

            $table->date('fecha_llamada');
            $table->time('hora_llamada');
            $table->text('asunto');

            $table->string('estatus_denuncia',1)->comment('P = Proceso, S = Solventado')->nullable();
            $table->string('unidad_aplicativa')->nullable();
            $table->integer('distrito')->nullable();
            $table->integer('categoria_llamada_id')->unsigned()->nullable();
            $table->text('seguimiento')->nullable();

            $table->integer('recibio_llamada')->unsigned()->nullable();
            $table->integer('turno_id')->unsigned()->nullable();

            $table->string('oficio_enviado_a')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('llamadas_call_center');
    }
}
