<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sites', function (Blueprint $table) {
            $table->increments('id');
            $table->string('site_name', 45)->nullable(false);
            $table->string('domain', 30)->nullable(true);
            $table->string('color_theme', 20)->nullable(true);
            $table->float('font_size')->nullable(true);
            $table->binary('logo_image')->nullable(true);
            $table->integer('is_published')->nullable(false)->default(0);
            $table->timestamps();
        });

        Schema::table('sites', function (Blueprint $table) {
            DB::statement('ALTER TABLE sites MODIFY COLUMN logo_image longblob');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sites');
    }
};
