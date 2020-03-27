<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTableRegistroLlenadoRespuestasAddFormularioId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('registro_llenado_respuestas', function (Blueprint $table) {
            $table->integer('formulario_id')->unsigned()->after('registro_llenado_id')->nullable();

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
        Schema::table('registro_llenado_respuestas', function (Blueprint $table) {
            $table->dropForeign(['formulario_id']);
            $table->dropColumn('formulario_id');
        });
    }
}
