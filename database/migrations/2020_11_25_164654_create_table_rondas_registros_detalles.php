<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableRondasRegistrosDetalles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rondas_registros_detalles', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('ronda_registro_id')->unsigned();
            $table->bigInteger('grupo_edad_id')->unsigned();
            $table->integer('total_masculino')->nullable();
            $table->integer('total_femenino')->nullable();
            $table->integer('infeccion_respiratoria_m')->nullable();
            $table->integer('infeccion_respiratoria_f')->nullable();
            $table->integer('covid_m')->nullable();
            $table->integer('covid_f')->nullable();
            $table->integer('tratamientos_otorgados')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('ronda_registro_id')->references('id')->on('rondas_registros');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rondas_registros_detalles');
    }
}
