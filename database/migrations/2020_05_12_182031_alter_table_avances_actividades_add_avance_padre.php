<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTableAvancesActividadesAddAvancePadre extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('avances_actividades', function (Blueprint $table) {
            $table->bigInteger('avance_padre_id')->unsigned()->nullable()->after('user_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('avances_actividades', function (Blueprint $table) {
            $table->dropColumn('avance_padre_id');
        });
    }
}
