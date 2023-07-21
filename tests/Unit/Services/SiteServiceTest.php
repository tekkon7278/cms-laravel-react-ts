<?php

namespace Tests\Unit;

// use PHPUnit\Framework\TestCase;
use Tests\TestCase;
use ReflectionClass;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;
use App\Repositories\SiteRepository;
use App\Models\SiteModel;
use App\Entities\Site;
use App\Services\SiteService;

class SiteServiceTest extends TestCase
{
    // use RefreshDatabase;

    protected $target;
    protected $reflection;

    protected $modelValuesSample1 = [
        'site_id' => 1,
        'site_name' => 'ほげほげ',
        'domain' => 'hoge.com',
        'font_size' => 1,
        'color_theme' => 'blue_1',
        'logo_image' => 'aa',
        'is_published' => 1,
    ];

    protected $modelValuesSample2 = [
        'site_id' => 2,
        'site_name' => 'ふがふが',
        'domain' => 'fuga.com',
        'font_size' => 1.1,
        'color_theme' => 'red_1',
        'logo_image' => 'dddd',
        'is_published' => 0,
    ];

    protected $entityValuesSample1 = [
        'id' => 1,
        'name' => 'ほげほげ',
        'domain' => 'hoge.com',
        'fontSize' => 1,
        'colorTheme' => 'blue_1',
        'logoImage' => 'aa',
        'isPublished' => 1,
    ];

    protected $entityValuesSample2 = [
        'id' => 2,
        'name' => 'ふがふが',
        'domain' => 'fuga.com',
        'fontSize' => 1.1,
        'colorTheme' => 'red_1',
        'logoImage' => 'dddd',
        'isPublished' => 0,
    ];

    protected function setUp(): void
    {
        parent::setUp();
        $this->target = new SiteService();
        $this->reflection = new ReflectionClass($this->target);
    }

    /**
     * @test
     */
    public function createSite()
    {
        $params = new Collection([
            'siteName' => 'サイト1',
        ]);
        $ret = $this->target->createSite($params);
        $this->assertTrue(is_int($ret));

        $params = new Collection([
            'siteId' => $ret,
        ]);
        $ret = $this->target->getSite($params);
        $this->assertInstanceOf(Site::class, $ret);
    }
   

}
