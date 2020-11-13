<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTableRondasRegistrosAddIdUsuarios extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('rondas_registros', function (Blueprint $table) {
            $table->integer('creado_por')->unsigned()->after('tratamientos_otorgados_casos_positivos');
            $table->integer('modificado_por')->unsigned()->after('creado_por')->nullable();
            $table->integer('borrado_por')->unsigned()->after('modificado_por')->nullable();
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
            $table->dropColumn('creado_por');
            $table->dropColumn('modificado_por');
            $table->dropColumn('borrado_por');
        });
    }
}
