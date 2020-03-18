<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableFormularios extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(){
        Schema::create('formularios', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('peso')->comment('del 1 al infinito, dependiendo lo requerido')->nullable();
            $table->string('descripcion');
            $table->string('categorias',100)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(){
        Schema::dropIfExists('formularios');
    }
}
