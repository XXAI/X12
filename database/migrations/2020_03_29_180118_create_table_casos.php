<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableCasos extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('casos', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('persona_id')->unsigned()->nullable();
            $table->integer('contingencia_id')->unsigned()->nullable();
            $table->date('fecha_deteccion')->nullable();
            $table->boolean('es_indice')->default(false);
            $table->bigInteger('caso_padre_id')->unsigned()->nullable();
            $table->integer('nivel')->nullable()->comment('ir sumando el nivel del padre hacia los hijos');
            $table->string('estatus_clave',10)->nullable();
            $table->string('valoracion_clave',10)->nullable();
            $table->string('latitud')->nullable();
            $table->string('longitud')->nullable();
            $table->text('observaciones')->nullable();
            $table->integer('capturado_por')->unsigned()->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('persona_id')->references('id')->on('personas');
            $table->foreign('contingencia_id')->references('id')->on('contingencias');
            $table->foreign('caso_padre_id')->references('id')->on('casos');
            $table->foreign('capturado_por')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('casos');
    }
}
