<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePacientesCovidTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pacientes_covid', function (Blueprint $table) {

            $table->bigIncrements('id');
            $table->integer('no_caso')->unsigned()->nullable();
            $table->string('nombre')->nullable();
            $table->string('sexo')->nullable();
            $table->integer('edad')->unsigned()->nullable();
            $table->integer('municipio_id')->unsigned()->nullable();
            $table->string('responsable')->nullable();
            $table->date('fecha_captura');
            $table->integer('tipo_atencion_id')->unsigned()->nullable();
            $table->integer('tipo_unidad_id')->unsigned()->nullable();
            $table->integer('estatus_covid_id')->unsigned()->nullable();
            $table->integer('derechohabiente_id')->unsigned()->nullable();
            $table->integer('distrito_id')->unsigned()->nullable();
            $table->integer('contactos')->unsigned()->nullable();
            $table->integer('tipo_transmision_id')->unsigned()->nullable();
            $table->date('fecha_inicio_sintoma');
            $table->date('fecha_confirmacion');
            $table->date('fecha_alta_14');
            $table->date('fecha_alta_21');
            $table->integer('dias_evolucion')->unsigned()->nullable();
            $table->date('fecha_alta_probable');
            $table->integer('egreso_id')->unsigned()->nullable();

            $table->softDeletes();
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pacientes_covid');
    }
}
