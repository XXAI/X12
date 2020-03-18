<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTablePreguntas extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('preguntas', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('formulario_id')->unsigned();
            $table->string('descripcion');
            $table->integer('tipo_pregunta_id')->unsigned();
            $table->integer('tipo_valor_id')->unsigned()->nullable();
            $table->boolean('obligatorio')->nullable();
            $table->integer('peso')->comment('del 1 al infinito, dependiendo lo requerido')->nullable();
            $table->integer('relevancia')->comment('0 = No Relevante, 1 = Relevante, 2 = Relevante cuando Condición = SI')->nullable();
            $table->string('relevancia_condicion',10)->nullable();
            $table->integer('relevancia_valor')->nullable();
            $table->integer('serie_id')->unsigned()->nullable();
            $table->boolean('visible')->nullable();
            $table->string('categorias',100)->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('formulario_id')->references('id')->on('formularios');
            $table->foreign('tipo_pregunta_id')->references('id')->on('catalogo_tipos_preguntas');
            $table->foreign('tipo_valor_id')->references('id')->on('catalogo_tipos_valores');
            $table->foreign('serie_id')->references('id')->on('series');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('preguntas');
    }
}
