<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableInfluezaDosisMetas extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('influenza_dosis_metas', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('distrito_id')->unsigned();
            $table->bigInteger('grupo_poblacion_id')->unsigned();
            $table->integer('meta_general');
            $table->integer('meta_diaria');
            $table->integer('avance_dosis_acumuladas')->nullable();
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
        Schema::dropIfExists('influenza_dosis_metas');
    }
}
