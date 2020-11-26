<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTableBrigadasAddField extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('brigadas', function (Blueprint $table) {
            $table->string('nombre_responsable_brigadas')->nullable()->after('distrito_id');
            $table->string('telefono_responsable_brigadas')->nullable()->after('nombre_responsable_brigadas');
            $table->string('email_responsable_brigadas')->nullable()->after('telefono_responsable_brigadas');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('brigadas', function (Blueprint $table) {
            $table->dropColumn('nombre_responsable_brigadas');
            $table->dropColumn('telefono_responsable_brigadas');
            $table->dropColumn('email_responsable_brigadas');
        });
    }
}
