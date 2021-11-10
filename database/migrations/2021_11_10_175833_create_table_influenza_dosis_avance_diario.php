<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableInfluenzaDosisAvanceDiario extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('influenza_dosis_avance_diario', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('distrito_id')->unsigned();
            $table->date('fecha_avance');
            $table->integer('avance_dia')->nullable();
            $table->integer('avance_acumulado')->nullable();
            $table->text('observaciones')->nullable();
            $table->boolean('solo_lectura')->nullable();
            $table->integer('usuario_id')->unsigned();
            $table->integer('creado_por')->unsigned();
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
        Schema::dropIfExists('influenza_dosis_avance_diario');
    }
}
