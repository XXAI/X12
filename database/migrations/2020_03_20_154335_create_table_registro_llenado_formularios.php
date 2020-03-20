<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableRegistroLlenadoFormularios extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('registro_llenado_formularios', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('formulario_id')->unsigned();
            $table->bigInteger('persona_id')->unsigned();
            $table->boolean('finalizado')->default(false);
            $table->timestamp('fecha_finalizado')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('formulario_id')->references('id')->on('formularios');
            $table->foreign('persona_id')->references('id')->on('personas');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('registro_llenado_formularios');
    }
}
