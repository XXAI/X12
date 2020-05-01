<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterPacientesCovidResponsableTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pacientes_covid', function (Blueprint $table) {
            
            $table->dropColumn('responsable');
            $table->integer('responsable_id')->after("municipio_id")->unsigned()->nullable();

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('pacientes_covid', function (Blueprint $table) {

            $table->integer('responsable_id')->unsigned()->nullable()->after("municipio_id");
            $table->dropColumn('responsable_id');
        });
    }
}
