<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterCatalogoMunicipios extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('catalogo_municipios', function (Blueprint $table) {
            $table->integer('poblacion')->unsigned()->after('descripcion');
            $table->decimal('longitud',15,8)->after('descripcion');
            $table->decimal('latitud', 15,8)->after('descripcion');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('catalogo_municipios', function (Blueprint $table) {
            $table->dropColumn('poblacion');
            $table->dropColumn('longitud');
            $table->dropColumn('latitud');
        });
    }
}
