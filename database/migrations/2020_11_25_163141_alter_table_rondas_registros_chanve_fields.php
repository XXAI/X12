<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTableRondasRegistrosChanveFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('rondas_registros', function (Blueprint $table) {
            $table->dropColumn('poblacion_beneficiada');
            $table->dropColumn('casos_sospechosos_identificados');
            $table->dropColumn('porcentaje_transmision');
            $table->dropColumn('tratamientos_otorgados_brigadeo');
            $table->dropColumn('tratamientos_otorgados_casos_positivos');

            $table->bigInteger('localidad_id')->unsigned()->nullable()->after('cabecera_recorrida_id');
            $table->integer('no_brigada')->nullable()->after('ronda_id');
            $table->integer('casas_promocionadas')->nullable()->after('casas_visitadas');
            $table->integer('casas_encuestadas')->nullable()->after('casas_promocionadas');
            $table->integer('casas_deshabitadas')->nullable()->after('casas_encuestadas');
            
            
            $table->integer('pacientes_referidos_valoracion')->nullable()->after('casas_renuentes');
            $table->integer('pacientes_referidos_hospitalizacion')->nullable()->after('pacientes_referidos_valoracion');
            $table->integer('pacientes_candidatos_muestra_covid')->nullable()->after('pacientes_referidos_hospitalizacion');
            /*$table->boolean('localidad_terminada')->nullable();*/
            /*$table->string('nombre_responsable_llenado')->nullable();*/
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('rondas_registros', function (Blueprint $table) {
            $table->integer('poblacion_beneficiada')->nullable();
            $table->integer('casos_sospechosos_identificados')->nullable();
            $table->integer('porcentaje_transmision')->nullable();
            $table->integer('tratamientos_otorgados_brigadeo')->nullable();
            $table->integer('tratamientos_otorgados_casos_positivos')->nullable();

            $table->dropColumn('localidad_id');
            $table->dropColumn('no_brigada');
            $table->dropColumn('casas_promocionadas');
            $table->dropColumn('casas_encuestadas');
            $table->dropColumn('casas_deshabitadas');
            $table->dropColumn('pacientes_referidos_validacion');
            $table->dropColumn('pacientes_referidos_hospitalizacion');
            $table->dropColumn('pacientes_candidatos_toma_muestra');
        });
    }
}
