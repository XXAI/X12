<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTableRondasRegistrosChangePorcentaje extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('rondas_registros', function (Blueprint $table) {
            $table->decimal('porcentaje_transmision',15,2)->default(' ')->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('rondas_registros', function (Blueprint $table) {
            $table->integer('porcentaje_transmision')->nullable()->change();
        });
    }
}
