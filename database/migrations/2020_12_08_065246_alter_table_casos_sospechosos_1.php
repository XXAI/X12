<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTableCasosSospechosos1 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('casos_sospechosos', function (Blueprint $table) {
            $table->string('ocupacion')->nullable()->change();
            $table->bigInteger('folio_incremento')->nullable()->after('folio');
            $table->integer('origen_id')->unsigned()->nullable()->after('folio_incremento');;
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('casos_sospechosos', function (Blueprint $table) {
            $table->dropColumn('folio_incremento');
            $table->dropColumn('origen_id');
        });
    }
}
