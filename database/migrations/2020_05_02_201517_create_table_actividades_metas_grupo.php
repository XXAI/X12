<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableActividadesMetasGrupo extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('actividades_metas_grupos', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('actividad_meta_id')->unsigned();
            $table->bigInteger('grupo_estrategico_id')->unsigned();
            $table->decimal('meta_programada',15,2)->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('actividad_meta_id')->references('id')->on('actividades_metas');
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
        Schema::dropIfExists('actividades_metas_grupos');
    }
}
