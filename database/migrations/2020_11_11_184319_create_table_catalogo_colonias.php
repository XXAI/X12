<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableCatalogoColonias extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('catalogo_colonias', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('distrito_id')->unsigned();
            $table->bigInteger('municipio_id')->unsigned();
            $table->bigInteger('localidad_id')->unsigned()->nullable();
            $table->string('nombre');
            $table->integer('usuario_captura_id')->unsigned();
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
        Schema::dropIfExists('catalogo_colonias');
    }
}
