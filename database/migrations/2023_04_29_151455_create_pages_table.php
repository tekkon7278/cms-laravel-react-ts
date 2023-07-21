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
        Schema::create('pages', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('site_id')->nullable(false)->references('id')->on('sites');
            $table->integer('parent_id')->nullable(false)->default(0);
            $table->string('pathname', 30)->nullable(true);
            $table->string('page_title', 100)->nullable(true);
            $table->integer('is_index')->nullable(false)->default(0);
            $table->integer('sort')->nullable(true);
            $table->integer('is_published')->nullable(false)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pages');
    }
};
