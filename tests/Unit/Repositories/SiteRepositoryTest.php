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

class SiteRepositoryTest extends TestCase
{
    // use RefreshDatabase;

    protected $target;
    protected $reflection;

    protected $modelValuesSample1 = [
        'id' => 1,
        'site_name' => 'ほげほげ',
        'domain' => 'hoge.com',
        'font_size' => 1,
        'color_theme' => 'blue_1',
        'logo_image' => 'aa',
        'is_published' => 1,
    ];

    protected $modelValuesSample2 = [
        'id' => 2,
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
        $this->target = new SiteRepository();
        $this->reflection = new ReflectionClass($this->target);
        $this->insertTestData();
    }

    protected function getMethod($name)
    {
        $method = $this->reflection->getMethod($name);
        $method->setAccessible(true);
        return $method;
    }

    protected function insertTestData()
    {
        DB::table('sites')->truncate();
        DB::table('sites')->insert($this->modelValuesSample1);
    }

    protected function getSiteModel()
    {
        $model = new SiteModel();
        return $model->where('site_id', 1)->first();
    }

    protected function getSiteModels()
    {
        $model = new SiteModel();
        return $model->get();
    }

    /**
     * @test
     */
    public function find()
    {
        $method = $this->getMethod('find');
        $ret = $method->invoke($this->target, 1);
        $this->assertInstanceOf(Site::class, $ret);
        $this->assertTrue($ret->has('name'));
        $this->assertTrue($ret->has('domain'));
        $this->assertTrue($ret->has('colorTheme'));
        $this->assertTrue($ret->has('logoImage'));
        $this->assertTrue($ret->has('isPublished'));
    }

    /**
     * @test
     */
    public function regist()
    {
        $site = new Site();
        $site->fill($this->entityValuesSample2);

        $method = $this->getMethod('regist');
        $ret = $method->invoke($this->target, $site);
        $this->assertTrue(is_int($ret));

        $ret = $this->target->find(2);
        $this->assertEquals($ret->toArray(), $this->entityValuesSample2);
    }

    /**
     * @test
     */
    public function update()
    {
        $site = new Site();
        $site->fill([
            'id' => 1,
            'name' => '更新太郎',
            'colorTheme' => 'green_1',
        ]);

        $method = $this->getMethod('update');
        $ret = $method->invoke($this->target, $site);

        $ret = $this->target->find(1);
        $this->assertEquals($ret->getName(), '更新太郎');
        $this->assertEquals($ret->getColorTheme(), 'green_1');

    }

    /**
     * @test
     */
    public function destroy()
    {
        $site = new Site();
        $site->fill([
            'id' => 1,
        ]);

        $method = $this->getMethod('destroy');
        $ret = $method->invoke($this->target, $site);

        $ret = $this->target->find(1);
        $this->assertNull($ret);
    }
    

}
