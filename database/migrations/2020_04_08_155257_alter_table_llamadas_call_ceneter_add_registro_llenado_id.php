<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTableLlamadasCallCeneterAddRegistroLlenadoId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('llamadas_call_center', function (Blueprint $table) {
            $table->bigInteger('registro_llenado_id')->unsigned()->nullable()->after('caso_id');
            $table->foreign('registro_llenado_id')->references('id')->on('registro_llenado_formularios');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('llamadas_call_center', function (Blueprint $table) {
            $table->dropForeign(['registro_llenado_id']);
            $table->dropColumn('registro_llenado_id');
        });
    }
}
