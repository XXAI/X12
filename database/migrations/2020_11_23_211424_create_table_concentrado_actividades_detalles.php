<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableConcentradoActividadesDetalles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('concentrado_actividades_brigadas_detalles', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('concentrado_actividad_brigada_id')->unsigned();
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
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('concentrado_actividades_brigadas_detalles');
    }
}
