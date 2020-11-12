<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTableRondasRegistrosChangeCabecerasColonias extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('rondas_registros', function (Blueprint $table) {
            $table->bigInteger('cabecera_recorrida_id')->unsigned()->nullable()->after('ronda_id');
            $table->bigInteger('colonia_visitada_id')->unsigned()->nullable()->after('cabecera_recorrida_id');

            $table->foreign('cabecera_recorrida_id')->references('id')->on('catalogo_municipios');
            $table->foreign('colonia_visitada_id')->references('id')->on('catalogo_colonias');

            $table->dropColumn('cabeceras_recorridas');
            $table->dropColumn('colonias_visitadas');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('rondas_registros', function (Blueprint $table) {
            $table->integer('cabeceras_recorridas')->nullable()->after('ronda_id');
            $table->integer('colonias_visitadas')->nullable()->after('cabeceras_recorridas');

            $table->dropForeign(['cabecera_recorrida_id']);
            $table->dropForeign(['colonia_visitada_id']);

            $table->dropColumn('cabecera_recorrida_id');
            $table->dropColumn('colonia_visitada_id');
        });
    }
}
