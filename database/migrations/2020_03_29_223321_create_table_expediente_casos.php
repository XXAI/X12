<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableExpedienteCasos extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('expediente_casos', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('caso_id')->unsigned();
            $table->text('descripcion');
            $table->date('fecha_atencion');
            $table->string('estatus_clave');
            $table->string('valoracion_clave');
            $table->integer('atendido_por')->unsigned()->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('caso_id')->references('id')->on('casos');
            $table->foreign('atendido_por')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('expediente_casos');
    }
}
