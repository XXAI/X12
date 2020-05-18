<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateArchivosGruposEstrategicosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('archivos_grupos', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('grupo_estrategico_id')->unsigned();

            $table->string('titulo');
            $table->string('path');
            
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('grupo_estrategico_id')->references('id')->on('grupos_estrategicos');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('archivos_grupos');
    }
}
