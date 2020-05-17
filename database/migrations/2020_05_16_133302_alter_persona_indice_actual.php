<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterPersonaIndiceActual extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('persona_indice', function (Blueprint $table) {
           
            $table->smallInteger('estatus_covid_id')->nullable()->unsigned()->change();
            $table->string('sexo')->nullable()->change();
            $table->string('alias')->nullable()->change();
            $table->smallInteger('edad')->unsigned()->nullable()->change();
            
            $table->smallInteger('responsable_id')->nullable()->change();
            $table->smallInteger('tipo_unidad_id')->nullable()->unsigned()->change();
            $table->smallInteger('tipo_atencion_id')->nullable()->unsigned()->change();
            $table->smallInteger('derechohabiente_id')->nullable()->unsigned()->change();
            $table->smallInteger('tipo_transmision_id')->nullable()->unsigned()->change();
            
            $table->date('fecha_inicio_sintoma')->nullable()->unsigned()->change();
            $table->date('fecha_confirmacion')->nullable()->unsigned()->change();
            $table->date('fecha_alta_probable')->nullable()->unsigned()->change();
            $table->date('fecha_alta_14')->nullable()->unsigned()->change();
            $table->date('fecha_alta_21')->nullable()->unsigned()->change();
            $table->smallInteger('egreso_id')->nullable()->unsigned()->change();
        });

        Schema::table('persona_contacto', function (Blueprint $table) {
            $table->dropColumn('sexo');
            $table->dropColumn('responsable_id');
            $table->dropColumn('tipo_unidad_id');
            $table->dropColumn('tipo_atencion_id');
            $table->dropColumn('derechohabiente_id');
            $table->dropColumn('tipo_transmision_id');
            $table->dropColumn('fecha_inicio_sintoma');
            $table->dropColumn('fecha_confirmacion');
            $table->dropColumn('fecha_alta_probable');
            $table->dropColumn('fecha_alta_14');
            $table->dropColumn('fecha_alta_21');
            $table->dropColumn('egreso_id');
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
