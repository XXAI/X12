<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableRondasColoniasEstatus extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rondas_colonias_estatus', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('ronda_id')->unsigned();
            $table->bigInteger('colonia_id')->unsigned();
            $table->date('fecha_termino')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('ronda_id')->references('id')->on('rondas');
            $table->foreign('colonia_id')->references('id')->on('catalogo_colonias');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rondas_colonias_estatus');
    }
}
