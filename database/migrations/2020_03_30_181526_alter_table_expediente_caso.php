<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTableExpedienteCaso extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('expediente_casos', function (Blueprint $table) {
            $table->string('estatus_clave',10)->change();
            $table->string('valoracion_clave',10)->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('expediente_casos', function (Blueprint $table) {
            $table->string('estatus_clave')->change();
            $table->string('valoracion_clave')->change();
        });
    }
}
