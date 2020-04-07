<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePersonaIndice extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('persona_indice', function (Blueprint $table) {
            $table->bigIncrements('id')->unsigned();
            $table->string('dispositivo_id')->nullable();
            $table->string('nombre');
            $table->string('apellido_paterno')->nullable();
            $table->string('apellido_materno')->nullable();
            $table->date('fecha_nacimiento')->nullable();
            $table->string('email')->nullable();
            $table->string('telefono_casa')->nullable();
            $table->string('telefono_celular')->nullable();
            $table->integer('estado_id')->unsigned()->nullable();
            $table->bigInteger('municipio_id')->unsigned()->nullable();
            $table->string('municipio')->nullable();
            $table->bigInteger('localidad_id')->unsigned()->nullable();
            $table->string('localidad')->nullable();
            $table->string('colonia')->nullable();
            $table->string('calle')->nullable();
            $table->string('no_exterior',50)->nullable();
            $table->string('no_interior',50)->nullable();
            $table->string('codigo_postal',10)->nullable();
            $table->text('referencia')->nullable();
            $table->string('latitud')->nullable();
            $table->string('longitud')->nullable();
            $table->text('observaciones')->nullable();
            $table->string('no_caso',100)->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('persona_indice');
    }
}
