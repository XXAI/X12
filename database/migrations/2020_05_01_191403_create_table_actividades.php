<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableActividades extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('actividades', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('estrategia_id')->unsigned();
            $table->string('descripcion');
            $table->decimal('total_meta_programada',15,2)->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('estrategia_id')->references('id')->on('estrategias');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('actividades');
    }
}
