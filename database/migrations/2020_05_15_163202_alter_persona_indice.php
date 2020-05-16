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
            $table->string('sexo', 255)->after('apellido_materno');
            $table->string('alias', 255)->after('apellido_materno');
            $table->smallInteger('edad')->unsigned()->after('apellido_materno');
            
            $table->smallInteger('responsable_id')->unsigned()->after('longitud');
            $table->smallInteger('tipo_unidad_id')->after('longitud');
            $table->smallInteger('tipo_atencion_id')->after('longitud');
            $table->smallInteger('derechohabiente_id')->after('longitud');
            $table->smallInteger('tipo_transmision_id')->after('longitud');
            
            $table->date('fecha_inicio_sintoma')->after('longitud');
            $table->date('fecha_confirmacion')->after('longitud');
            $table->date('fecha_alta_probable')->after('longitud');
            $table->date('fecha_alta_14')->after('longitud');
            $table->date('fecha_alta_21')->after('longitud');
            $table->smallInteger('egreso_id')->after('longitud');
        });

        Schema::table('persona_contacto', function (Blueprint $table) {
            $table->string('sexo', 255)->after('apellido_materno');
            
            $table->smallInteger('responsable_id')->unsigned()->after('longitud');
            $table->smallInteger('tipo_unidad_id')->after('longitud');
            $table->smallInteger('tipo_atencion_id')->after('longitud');
            $table->smallInteger('derechohabiente_id')->after('longitud');
            $table->smallInteger('tipo_transmision_id')->after('longitud');
            
            $table->date('fecha_inicio_sintoma')->after('longitud');
            $table->date('fecha_confirmacion')->after('longitud');
            $table->date('fecha_alta_probable')->after('longitud');
            $table->date('fecha_alta_14')->after('longitud');
            $table->date('fecha_alta_21')->after('longitud');
            $table->smallInteger('egreso_id')->after('longitud');
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
            $table->dropColumn('sexo');
            $table->dropColumn('alias');
            $table->dropColumn('edad');
            $table->dropColumn('responsable_id');
            $table->dropColumn('tipo_unidad_id');
            $table->dropColumn('tipo_atecion_id');
            $table->dropColumn('derechohabiente_id');
            $table->dropColumn('tipo_transmision_id');
            $table->dropColumn('fecha_inicio_sintoma');
            $table->dropColumn('fecha_confirmacion');
            $table->dropColumn('fecha_alta_probable');
            $table->dropColumn('fecha_alta_14');
            $table->dropColumn('fecha_alta_21');
            $table->dropColumn('egreso_id');
        });
        Schema::table('persona_contacto', function (Blueprint $table) {
            $table->dropColumn('sexo');
            $table->dropColumn('alias');
            $table->dropColumn('edad');
            $table->dropColumn('responsable_id');
            $table->dropColumn('tipo_unidad_id');
            $table->dropColumn('tipo_atecion_id');
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
}