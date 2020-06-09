<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTablePacienteIndiceAddNewColumns extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('persona_indice', function (Blueprint $table) {
            $table->date('fecha_alta_cadena')->nullable()->after('fecha_alta');
            $table->integer('contactos_intradomiciliarios_sinto')->nullable()->after('fecha_inicio_sintoma');
            $table->integer('contactos_intradomiciliarios_asinto')->nullable()->after('contactos_intradomiciliarios_sinto');
            $table->integer('contactos_extradomiciliarios_sinto')->nullable()->after('contactos_intradomiciliarios_asinto');
            $table->integer('contactos_extradomiciliarios_asinto')->nullable()->after('contactos_extradomiciliarios_sinto');
            $table->integer('total_dias_hospitalizacion')->nullable()->after('fecha_ingreso_hospital');
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
            $table->dropColumn('fecha_alta_cadena');
            $table->dropColumn('contactos_intradomiciliarios_sinto');
            $table->dropColumn('contactos_intradomiciliarios_asinto');
            $table->dropColumn('contactos_extradomiciliarios_sinto');
            $table->dropColumn('contactos_extradomiciliarios_asinto');
            $table->dropColumn('total_dias_hospitalizacion');
        });
    }
}
