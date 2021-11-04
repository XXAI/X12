<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEstadisticasCovid extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('estadisticas_covid', function (Blueprint $table) {
            $table->smallIncrements('id');
            $table->bigInteger('grupo_estrategico_id')->unsigned()->index();
            $table->date('fecha')->index();
            $table->integer('obstetricas')->nullable()->index();
            $table->integer('recien_nacidos')->nullable()->index();
            $table->integer('pacientes_ingresados');
            $table->integer('pacientes_internados');
            $table->integer('estables');
            $table->integer('delicados');
            $table->integer('graves');
            $table->integer('pacientes_altas');
            $table->integer('pacientes_defunciones');
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
        Schema::dropIfExists('estadisticas_covid');
    }
}
