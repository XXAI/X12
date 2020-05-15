<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterPersonaIndice extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('persona_indice', function (Blueprint $table) {
           
            $table->smallInteger('estatus_covid_id')->after('longitud');
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
            $table->dropColumn('estatus_covid_id');
        });
    }
}
