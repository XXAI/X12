<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePreguntasSeries extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('preguntas_series', function (Blueprint $table) {
            $table->integer('serie_id')->unsigned();
            $table->bigInteger('pregunta_id')->unsigned();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('pregunta_id')->references('id')->on('preguntas');
            $table->foreign('serie_id')->references('id')->on('series');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('preguntas_series');
    }
}
