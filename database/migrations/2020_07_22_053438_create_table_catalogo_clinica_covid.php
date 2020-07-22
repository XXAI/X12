<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableCatalogoClinicaCovid extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('catalogo_clinica_covid', function (Blueprint $table) {
            $table->bigIncrements('id')->unsigned();
            $table->string('nombre_unidad', 254);
            $table->smallInteger('camas_hospitalizacion')->unsigned();
            $table->smallInteger('ventilador')->unsigned();
            $table->smallInteger('monitor')->unsigned();
            $table->smallInteger('bomba_infusion')->unsigned();
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
        Schema::dropIfExists('catalogo_clinica_covid');
    }
}
