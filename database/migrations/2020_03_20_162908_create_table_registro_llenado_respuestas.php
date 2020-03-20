<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableRegistroLlenadoRespuestas extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('registro_llenado_respuestas', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('registro_llenado_id')->unsigned();
            $table->bigInteger('persona_id')->unsigned();
            $table->bigInteger('pregunta_id')->unsigned();
            $table->string('valor')->nullable()->comment('En caso de que la pregunta sea de tipo valor');
            $table->bigInteger('respuesta_id')->unsigned()->nullable();
            $table->integer('valor_respuesta')->nullable();
            $table->integer('relevancia')->nullable();
            $table->integer('peso')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('registro_llenado_id')->references('id')->on('registro_llenado_formularios');
            $table->foreign('persona_id')->references('id')->on('personas');
            $table->foreign('pregunta_id')->references('id')->on('preguntas');
            $table->foreign('respuesta_id')->references('id')->on('respuestas');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('registro_llenado_respuestas');
    }
}
