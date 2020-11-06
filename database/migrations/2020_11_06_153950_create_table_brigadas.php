<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableBrigadas extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('brigadas', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('grupo_estrategico_id')->unsigned();
            $table->bigInteger('distrito_id')->unsigned()->nullable();
            $table->integer('total_brigadistas')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('grupo_estrategico_id')->references('id')->on('grupos_estrategicos');
            $table->foreign('distrito_id')->references('id')->on('catalogo_distritos');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('brigadas');
    }
}
