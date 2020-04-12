<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateInformacionCovid extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('informacion_covid', function (Blueprint $table) {
            $table->Increments('id');
            $table->smallInteger('sospechosos')->default(0)->unsigned();
            $table->smallInteger('muestras')->default(0)->unsigned();
            $table->smallInteger('pendientes')->default(0)->unsigned();
            $table->smallInteger('positivos')->default(0)->unsigned();
            $table->smallInteger('negativos')->default(0)->unsigned();
            $table->smallInteger('recuperados')->default(0)->unsigned();
            $table->smallInteger('defunciones')->default(0)->unsigned();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('informacion_covid');
    }
}
