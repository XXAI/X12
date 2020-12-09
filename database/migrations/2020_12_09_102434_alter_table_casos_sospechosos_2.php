<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTableCasosSospechosos2 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('casos_sospechosos', function (Blueprint $table) {
            $table->boolean('esta_embarazada')->nullable()->after('ocupacion');
            $table->integer('meses_embarazo')->nullable()->after('esta_embarazada');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('casos_sospechosos', function (Blueprint $table) {
            $table->dropColumn('esta_embarazada');
            $table->dropColumn('meses_embarazo');
        });
    }
}
