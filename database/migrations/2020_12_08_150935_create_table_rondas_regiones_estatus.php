<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableRondasRegionesEstatus extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rondas_regiones_estatus', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('ronda_id')->unsigned();
            $table->bigInteger('municipio_id')->unsigned();
            $table->integer('region');
            $table->date('fecha_termino')->nullable();
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
        Schema::dropIfExists('rondas_regiones_estatus');
    }
}
