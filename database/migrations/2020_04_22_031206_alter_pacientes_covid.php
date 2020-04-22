<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterPacientesCovid extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pacientes_covid', function (Blueprint $table) {
            $table->dropColumn('fecha_captura');
            $table->dropColumn('distrito_id');
            $table->dropColumn('dias_evolucion');
            $table->string('alias', 100)->nullable()->after("nombre");
            $table->integer('egreso_id')->after("fecha_alta_probable")->default(1)->unsigned()->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('pacientes_covid', function (Blueprint $table) {
            $table->date('fecha_captura')->nullable()->after("responsable");
            $table->integer('distrito_id')->unsigned()->nullable()->after("derechohabiente_id");
            $table->integer('dias_evolucion')->unsigned()->nullable()->after("fecha_alta_21");
            $table->dropColumn('alias');
            $table->dropColumn('egreso_id');
        });
    }
}
