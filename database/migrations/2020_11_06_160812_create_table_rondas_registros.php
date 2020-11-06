<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableRondasRegistros extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rondas_registros', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('ronda_id')->unsigned();
            $table->date('fecha_registro')->default(DB::raw('current_date()'));

            $table->integer('cabeceras_recorridas')->nullable();
            $table->integer('colonias_visitadas')->nullable();
            $table->integer('poblacion_beneficiada')->nullable();

            $table->integer('casas_visitadas')->nullable();
            $table->integer('casas_ausentes')->nullable();
            $table->integer('casas_renuentes')->nullable();

            $table->integer('casos_sospechosos_identificados')->nullable();
            $table->integer('porcentaje_transmision')->nullable();

            $table->integer('tratamientos_otorgados_brigadeo')->nullable();
            $table->integer('tratamientos_otorgados_casos_positivos')->nullable();
            
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('ronda_id')->references('id')->on('rondas');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rondas_registros');
    }
}
