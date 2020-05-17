<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTableCatalogoDistritosAddForeignKeys extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        Schema::table('catalogo_distritos', function (Blueprint $table) {

            $table->string('clave', 2)->nullable()->after('id');
            $table->integer('estado_id')->unsigned()->after('clave');

        });
        


    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {

        Schema::table('catalogo_distritos', function (Blueprint $table) {
            
            $table->dropColumn('clave');
            $table->dropColumn('estado_id');
        });

    }
}
