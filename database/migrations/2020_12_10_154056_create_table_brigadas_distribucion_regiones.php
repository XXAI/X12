<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableBrigadasDistribucionRegiones extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('brigadas_distribucion_regiones', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('distrito_id')->unsigned()->nullable();
            $table->bigInteger('municipio_id')->unsigned()->nullable();
            $table->bigInteger('localidad_id')->unsigned()->nullable();
            $table->integer('grupo')->nullable();
            $table->integer('zona')->nullable();
            $table->integer('region')->nullable();
            $table->string('nombre_encargado')->nullable();
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
        Schema::dropIfExists('brigadas_distribucion_regiones');
    }
}
