<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableLocalidades extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('catalogo_localidades', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('municipio_id')->unsigned();
            $table->string('clave',4);
            $table->string('clave_ofi',7);
            $table->string('descripcion');
            $table->string('coordenadas_google')->nullable();
            $table->boolean('indigenas')->nullable();
            $table->boolean('cruzada')->nullable();
            $table->bigInteger('p_total')->nullable();
            $table->string('longitud')->nullable();
            $table->string('latitud')->nullable();
            $table->string('altitud')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('municipio_id')->references('id')->on('catalogo_municipios');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('catalogo_localidades');
    }
}
