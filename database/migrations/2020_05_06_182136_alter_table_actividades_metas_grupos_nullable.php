<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTableActividadesMetasGruposNullable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('actividades_metas_grupos', function (Blueprint $table) {
            $table->bigInteger('actividad_meta_id')->unsigned()->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('actividades_metas_grupos', function (Blueprint $table) {
            $table->bigInteger('actividad_meta_id')->unsigned()->change();
        });
    }
}
