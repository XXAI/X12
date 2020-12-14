<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableBitacoraCasosSospechosos extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bitacora_casos_sospechosos', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('caso_id')->unsigned()->nullable();
            $table->integer('user_id')->unsigned()->nullable();
            $table->string('seguimiento',500)->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->foreign('caso_id')->references('id')->on('casos_sospechosos');
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
        Schema::dropIfExists('bitacora_casos_sospechosos');
    }
}
