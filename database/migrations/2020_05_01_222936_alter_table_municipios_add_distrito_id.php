<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTableMunicipiosAddDistritoId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('catalogo_municipios', function (Blueprint $table) {
            $table->bigInteger('distrito_id')->unsigned()->nullable()->after('estado_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('catalogo_municipios', function (Blueprint $table) {
            $table->dropColumn('distrito_id');
        });
    }
}
