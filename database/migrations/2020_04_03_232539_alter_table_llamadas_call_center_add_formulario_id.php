<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTableLlamadasCallCenterAddFormularioId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('llamadas_call_center', function (Blueprint $table) {
            $table->integer('formulario_id')->unsigned()->nullable()->after('persona_id');
            $table->foreign('formulario_id')->references('id')->on('formularios');
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
            $table->dropForeign(['formulario_id']);
            $table->dropColumn('formulario_id');
        });
    }
}
