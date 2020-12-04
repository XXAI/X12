<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableConfigUsuariosBrigadasRegistros extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('config_usuarios_brigadas_registros', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('usuario_id')->unsigned()->nullable();
            $table->bigInteger('distrito_id')->unsigned()->nullable();
            $table->bigInteger('municipio_id')->unsigned()->nullable();
            $table->integer('zona')->nullable();
            $table->integer('region')->nullable();
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
        Schema::dropIfExists('config_usuarios_brigadas_registros');
    }
}
