<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterPacienteCovidFechas extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('persona_indice', function (Blueprint $table) {
            $table->date('fecha_ingreso_hospital')->nullable()->after("fecha_confirmacion");
            $table->date('fecha_alta')->nullable()->after("fecha_confirmacion");
            $table->date('fecha_defuncion')->nullable()->after("fecha_confirmacion");
            
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
            $table->dropColumn(['fecha_ingreso_hospital', 'fecha_alta', 'fecha_defuncion']);
        });
    }
}
