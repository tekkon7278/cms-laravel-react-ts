<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services;
use App\Repositories;
use App\Entities;

class AppServiceProvider extends ServiceProvider
{
    public $bindings = [
        'SiteService' => Services\SiteService::class,
        'SiteRepository' => Repositories\SiteRepository::class,
        'PageRepository' => Repositories\PageRepository::class,
        'ContentRepository' => Repositories\ContentRepository::class,
        'Site' => Entities\Site::class,
        'Page' => Entities\Page::class,
        'ContentFactory' => Entities\Content\ContentFactory::class,
        'Content' => Entities\Content\Content::class,
        'TextContent' => Entities\Content\TextContent::class,
        'TitleContent' => Entities\Content\TitleContent::class,
        'CodeContent' => Entities\Content\CodeContent::class,
        'ListContent' => Entities\Content\ListContent::class,
        'ImageContent' => Entities\Content\ImageContent::class,
        'ColumnsLayout' => Entities\Content\ColumnsLayout::class,
    ];
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
