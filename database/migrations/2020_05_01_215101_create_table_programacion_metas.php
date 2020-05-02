<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableProgramacionMetas extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('actividades_metas', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('actividad_id')->unsigned();
            $table->bigInteger('distrito_id')->unsigned()->nullable();
            $table->bigInteger('municipio_id')->unsigned()->nullable();
            $table->bigInteger('localidad_id')->unsigned()->nullable();
            $table->decimal('meta_programada',15,2)->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('actividad_id')->references('id')->on('actividades');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('actividades_metas');
    }
}
