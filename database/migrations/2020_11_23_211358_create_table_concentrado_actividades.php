<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableConcentradoActividades extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('concentrado_actividades_brigadas', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('brigada_id')->unsigned();
            $table->bigInteger('distrito_id')->unsigned()->nullable();
            $table->bigInteger('municipio_id')->unsigned()->nullable();
            $table->bigInteger('localidad_id')->unsigned()->nullable();
            $table->bigInteger('colonia_id')->unsigned()->nullable();
            $table->date('fecha')->nullable();
            $table->boolean('localidad_terminada')->nullable();
            $table->integer('no_brigadas')->nullable();
            $table->integer('total_personas_brigadas')->nullable();
            $table->integer('total_brigadistas')->nullable();
            $table->integer('casas_visitadas')->nullable();
            $table->integer('casas_promocionadas')->nullable();
            $table->integer('casas_encuestadas')->nullable();
            $table->integer('casas_deshabitadas')->nullable();
            $table->integer('casas_ausentes')->nullable();
            $table->integer('casas_renuentes')->nullable();
            $table->integer('pacientes_referidos_validacion')->nullable();
            $table->integer('pacientes_referidos_hospitalizacion')->nullable();
            $table->integer('pacientes_candidatos_toma_muestra')->nullable();
            $table->string('nombre_responsable_llenado')->nullable();
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
        Schema::dropIfExists('concentrado_actividades_brigadas');
    }
}
