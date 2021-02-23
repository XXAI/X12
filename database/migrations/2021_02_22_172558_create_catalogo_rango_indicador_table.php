<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCatalogoRangoIndicadorTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('catalogo_rango_indicador', function (Blueprint $table) {
            $table->smallIncrements('id');
            $table->smallInteger('indicador_id')->unsigned()->nullable();
            $table->string('rango');
            $table->integer('valor')->nullable();

            $table->softDeletes();
            $table->timestamps();

            $table->foreign('indicador_id')->references('id')->on('catalogo_indicador');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('catalogo_rango_indicador');
    }
}
