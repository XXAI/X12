<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableRespuestasPersonas extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('respuestas_personas', function (Blueprint $table) {
            $table->bigInteger('persona_id')->unsigned();
            $table->bigInteger('pregunta_id')->unsigned();
            $table->string('valor')->nullable();
            $table->bigInteger('respuesta_id')->unsigned()->nullable();
            $table->integer('valor_respuesta')->nullable();
            $table->integer('relevancia')->nullable();
            $table->integer('peso')->nullable();
            $table->timestamps();
            $table->softDeletes();

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
        Schema::dropIfExists('respuestas_personas');
    }
}
