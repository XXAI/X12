<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTableInfluenzaDosisAvanceDiarioChangeAvanceAcumulado extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('influenza_dosis_avance_diario', function (Blueprint $table) {
            $table->renameColumn('avance_acumulado','meta_dia');
            $table->decimal('porcentaje_meta_dia',15,2)->after('avance_acumulado')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('influenza_dosis_avance_diario', function (Blueprint $table) {
            $table->renameColumn('meta_dia','avance_acumulado');
            $table->dropColumn('porcentaje_meta_dia');
        });
    }
}
