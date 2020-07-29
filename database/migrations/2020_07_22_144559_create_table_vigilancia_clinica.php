<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableVigilanciaClinica extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vigilancia_clinica', function (Blueprint $table) {
            $table->bigIncrements('id')->unsigned();
            $table->bigInteger('clinica_id')->unsigned();
            $table->string('nombre_paciente');
            $table->bigInteger('municipio_id')->unsigned()->nullable();
            $table->smallInteger('edad')->nullable();
            $table->string('sexo', 2)->nullable();
            $table->date('fecha_inicio')->nullable();
            $table->date('fecha_ingreso')->nullable();
            $table->date('fecha_intubado')->nullable();
            $table->string('folio_pcr', 200)->nullable();
            $table->smallInteger('no_caso')->unsigned()->nullable();
            $table->text('diagnostico')->nullable();
            $table->bigInteger('estatus_paciente_id')->unsigned();
            $table->bigInteger('estatus_egreso_id')->unsigned();
            $table->smallInteger('intubado')->unsigned()->nullable();
            $table->string('servicio_cama', 200)->nullable();
            $table->decimal('pco_fipco', 15, 2)->nullable();
            $table->decimal('saturado_02', 15, 2)->nullable();
            $table->text('observaciones')->nullable();
            $table->smallInteger('ventilador')->unsigned()->default(0);
            $table->smallInteger('monitor')->unsigned()->default(0);
            $table->smallInteger('bomba_infusion')->unsigned()->default(0);
            $table->smallInteger('no_bombas')->unsigned();
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('clinica_id')->references('id')->on('catalogo_clinica_covid');
            $table->foreign('municipio_id')->references('id')->on('catalogo_municipios');
            $table->foreign('estatus_paciente_id')->references('id')->on('catalogo_estatus_paciente');
            $table->foreign('estatus_egreso_id')->references('id')->on('catalogo_egresos_covid');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('vigilancia_clinica');
    }
}
