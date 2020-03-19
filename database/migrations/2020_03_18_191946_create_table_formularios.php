<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableFormularios extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(){
        Schema::create('formularios', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('peso')->comment('del 1 al infinito, dependiendo lo requerido')->nullable();
            $table->string('descripcion');
            $table->string('categorias',100)->nullable();
            $table->boolean('activo')->default(false);
            $table->integer('creado_por')->unsigned()->nullable();
            $table->integer('ultima_edicion_por')->unsigned()->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('creado_por')->references('id')->on('users');
            $table->foreign('ultima_edicion_por')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(){
        Schema::dropIfExists('formularios');
    }
}
