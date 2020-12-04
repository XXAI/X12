<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTableTablaRondasRegistrosAddCampos extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('rondas_registros', function (Blueprint $table) {
            $table->integer('embarazadas')->nullable()->after('casas_renuentes');
            $table->integer('diabeticos')->nullable()->after('embarazadas');
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
            $table->dropColumn('embarazadas');
            $table->dropColumn('diabeticos');
        });
    }
}
