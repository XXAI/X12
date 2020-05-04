<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableAvancesActividades extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('avances_actividades', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('estrategia_id')->unsigned();
            $table->bigInteger('actividad_id')->unsigned();
            $table->bigInteger('actividad_meta_id')->unsigned()->nullable();
            $table->bigInteger('grupo_estrategico_id')->unsigned()->nullable();
            $table->decimal('avance',15,2)->nullable();
            $table->text('observaciones')->nullable();
            $table->date('fecha_avance');
            $table->integer('user_id')->unsigned();
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
        Schema::dropIfExists('avances_actividades');
    }
}
