<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableCasosSospechosos extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('casos_sospechosos', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('folio')->nullable();
            $table->date('fecha_identificacion')->nullable();
            $table->integer('tipo_paciente_id')->unsigned()->nullable();
            $table->string('apellido_paterno')->nullable();
            $table->string('apellido_materno')->nullable();
            $table->string('nombre')->nullable();
            $table->string('sexo',1)->nullable();
            $table->integer('edad')->unsigned()->nullable();
            $table->string('ocupacion',1)->nullable();

            $table->bigInteger('municipio_id')->unsigned()->nullable();
            $table->bigInteger('localidad_id')->unsigned()->nullable();
            $table->bigInteger('colonia_id')->unsigned()->nullable();

            $table->string('domicilio')->nullable();
            $table->string('telefonos')->nullable();

            $table->boolean('diabetes')->nullable();
            $table->boolean('hipertension')->nullable();
            $table->boolean('obesidad')->nullable();
            $table->boolean('epoc')->nullable();
            $table->boolean('asma')->nullable();
            $table->boolean('inmunosupresion')->nullable();
            $table->boolean('vih_sida')->nullable();
            $table->boolean('enfermedad_cardiovascular')->nullable();
            $table->boolean('insuficiencia_renal')->nullable();
            $table->boolean('tabaquismo')->nullable();

            $table->boolean('inicio_subito_sintomas')->nullable();
            $table->boolean('fiebre')->nullable();
            $table->boolean('tos')->nullable();
            $table->boolean('cefalea')->nullable();
            $table->boolean('disnea')->nullable();
            $table->boolean('irritabilidad')->nullable();
            $table->boolean('dolor_toracico')->nullable();
            $table->boolean('escalofrios')->nullable();
            $table->boolean('odinofagia')->nullable();
            $table->boolean('mialgias')->nullable();
            $table->boolean('artralgias')->nullable();
            $table->boolean('anosmia')->nullable();
            $table->boolean('disgeusia')->nullable();
            $table->boolean('rinorrea')->nullable();
            $table->boolean('conjuntivitis')->nullable();
            $table->boolean('ataque_estado_general')->nullable();
            $table->boolean('diarrea')->nullable();
            $table->boolean('polipnea')->nullable();
            $table->boolean('dolor_abdominal')->nullable();
            $table->boolean('vomito')->nullable();
            $table->boolean('cianosis')->nullable();

            $table->date('fecha_inicio_sintomas')->nullable();
            $table->date('fecha_termino_seguimiento')->nullable();//sumar 14 dias de inicio de sintomas

            $table->string('tratamiento', 254)->nullable();
            $table->date('fecha_inicio_tratamiento')->nullable();
            $table->date('fecha_termino_tratamiento')->nullable();
            $table->string('causa_no_tratamiento')->nullable();

            $table->boolean('tuvo_tratamiento_previo_para_covid')->nullable();
            $table->string('tratamiento_previo_para_covid', 254)->nullable();
            $table->date('fecha_tratamiento_anterior')->nullable();
            $table->string('quien_otorgo_tratamiento_anterior')->nullable();

            $table->integer('contactos_sintomaticos')->nullable();
            $table->integer('contactos_asintomaticos')->nullable();
            $table->integer('numero_contactos')->nullable();

            $table->string('condicion_egreso')->nullable();

            $table->integer('user_id')->unsigned()->nullable();
           
            $table->timestamps();

            $table->softDeletes();

            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('casos_sospechosos');
    }
}
