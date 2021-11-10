<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableInfluenzaDosisAvanceDiarioDetalle extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('influenza_dosis_avance_diario_detalle', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('avance_diario_id')->unsigned();
            $table->bigInteger('dosis_meta_id')->unsigned();
            $table->integer('avance');
            $table->text('observaciones')->nullable();
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
        Schema::dropIfExists('influenza_dosis_avance_diario_detalle');
    }
}
