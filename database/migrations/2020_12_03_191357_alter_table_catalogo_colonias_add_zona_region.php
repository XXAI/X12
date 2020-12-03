<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTableCatalogoColoniasAddZonaRegion extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('catalogo_colonias', function (Blueprint $table) {
            $table->integer('zona')->nullable()->after('localidad_id');
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
        Schema::table('catalogo_colonias', function (Blueprint $table) {
            $table->dropColumn('zona');
            $table->dropColumn('region');
        });
    }
}
