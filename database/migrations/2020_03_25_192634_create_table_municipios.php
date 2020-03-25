<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableMunicipios extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('catalogo_municipios', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('estado_id')->unsigned();
            $table->string('clave',3);
            $table->string('descripcion');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('estado_id')->references('id')->on('catalogo_estados');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('catalogo_municipios');
    }
}
