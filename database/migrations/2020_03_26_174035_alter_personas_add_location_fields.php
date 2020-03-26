<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterPersonasAddLocationFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('personas', function (Blueprint $table) {
            $table->integer('estado_id')->unsigned()->nullable()->after('telefono_celular');
            $table->bigInteger('municipio_id')->unsigned()->nullable()->after('estado_id');
            $table->string('municipio')->nullable()->after('municipio_id');
            $table->bigInteger('localidad_id')->unsigned()->nullable()->after('municipio');
            $table->string('localidad')->nullable()->after('localidad_id');
            $table->string('colonia')->nullable()->after('localidad');
            $table->string('calle')->nullable()->after('colonia');
            $table->string('no_exterior',50)->nullable()->after('calle');
            $table->string('no_interior',50)->nullable()->after('no_exterior');
            $table->text('referencia')->nullable()->after('no_interior');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('personas', function (Blueprint $table) {
            $table->dropColumn('estado_id');
            $table->dropColumn('municipio_id');
            $table->dropColumn('municipio');
            $table->dropColumn('localidad_id');
            $table->dropColumn('localidad');
            $table->dropColumn('colonia');
            $table->dropColumn('calle');
            $table->dropColumn('no_exterior');
            $table->dropColumn('no_interior');
            $table->dropColumn('referencia');
        });
    }
}
