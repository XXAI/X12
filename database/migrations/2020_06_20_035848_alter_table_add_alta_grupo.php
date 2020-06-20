<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTableAddAltaGrupo extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('persona_indice', function (Blueprint $table) {
            $table->date('fecha_alta_grupo')->nullable()->after('fecha_alta');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('persona_indice', function (Blueprint $table) {
            $table->dropColumn('fecha_alta_grupo');
        });
    }
}
