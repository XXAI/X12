<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTablePosiblesAltas extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('persona_indice_posibles_altas', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('persona_indice_id')->unsigned();
            $table->integer('usuario_solicita_id')->unsigned();
            $table->date('fecha_solicitud')->nullable();
            $table->text('razon_alta')->nullable();
            $table->boolean('estatus')->nullable();
            $table->date('fecha_validacion')->nullable();
            $table->text('razon_validacion')->nullable();
            $table->integer('usuario_valida_id')->unsigned()->nullable();
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
        Schema::dropIfExists('persona_indice_posibles_altas');
    }
}
