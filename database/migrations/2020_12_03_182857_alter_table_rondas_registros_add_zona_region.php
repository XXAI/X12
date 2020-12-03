<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTableRondasRegistrosAddZonaRegion extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('rondas_registros', function (Blueprint $table) {
            $table->integer('zona')->nullable()->after('no_brigada');
            $table->integer('region')->nullable()->after('zona');
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
            $table->dropColumn('zona');
            $table->dropColumn('region');
        });
    }
}
