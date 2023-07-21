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
        Schema::create('contents', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('parent_id')->nullable(true);
            $table->integer('page_id')->nullable(false)->references('id')->on('pages');
            $table->integer('content_type')->nullable(true);
            $table->string('content_title', 100)->nullable(true);
            $table->text('content')->nullable(true);
            $table->binary('binary_content')->nullable(true);
            $table->integer('sort')->nullable(true);
            $table->integer('is_published')->nullable(false)->default(0);
            $table->timestamps();
        });
        
        Schema::table('sites', function (Blueprint $table) {
            DB::statement('ALTER TABLE contents MODIFY COLUMN binary_content longblob');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('contents');
    }
};
