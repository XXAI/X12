<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSemaforosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('semaforos', function (Blueprint $table) {
            $table->smallIncrements('id');
            $table->date('fecha_inicio')->nullable()->index();
            $table->date('fecha_fin')->nullable()->index();
            $table->smallInteger('rango_indicador_id')->unsigned()->nullable()->index();
            $table->integer('valor');          
            $table->integer('resultado'); 
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('rango_indicador_id')->references('id')->on('catalogo_rango_indicador');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('semaforos');
    }
}
