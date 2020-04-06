<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTableRegistroLlenadoFormulariosAddCasoId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('registro_llenado_formularios', function (Blueprint $table) {
            $table->bigInteger('caso_id')->unsigned()->nullable()->after('persona_id');
            $table->foreign('caso_id')->references('id')->on('casos');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('registro_llenado_formularios', function (Blueprint $table) {
            $table->dropForeign(['caso_id']);
            $table->dropColumn('caso_id');
        });
    }
}
