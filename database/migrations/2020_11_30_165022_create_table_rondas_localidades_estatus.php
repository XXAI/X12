<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableRondasLocalidadesEstatus extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rondas_localidades_estatus', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('ronda_id')->unsigned();
            $table->bigInteger('localidad_id')->unsigned();
            $table->date('fecha_termino')->default(DB::raw('current_date()'));
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('ronda_id')->references('id')->on('rondas');
            $table->foreign('localidad_id')->references('id')->on('catalogo_localidades');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rondas_localidades_estatus');
    }
}
