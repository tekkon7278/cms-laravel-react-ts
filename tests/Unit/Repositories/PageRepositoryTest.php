<?php

namespace Tests\Unit;

// use PHPUnit\Framework\TestCase;
use Tests\TestCase;
use ReflectionClass;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;
use App\Repositories\PageRepository;
use App\Models\PageModel;
use App\Entities\Page;

class PageRepositoryTest extends TestCase
{
    // use RefreshDatabase;

    protected $target;
    protected $reflection;

    protected $modelValuesSample1 = [
        'id' => 1,
        'site_id' => 1,
        'page_title' => 'HOME',
        'pathname' => 'home',
        'is_index' => 1,
        'is_published' => 1,
    ];

    protected $modelValuesSample2 = [
        'id' => 2,
        'site_id' => 1,
        'page_title' => '会社概要',
        'pathname' => 'company',
        'is_index' => 0,
        'is_published' => 0,
    ];

    protected $entityValuesSample1 = [
        'id' => 1,
        'siteId' => 1,
        'title' => 'HOME',
        'pathname' => 'home',
        'isIndex' => 1,
        'isPublished' => true,
    ];

    protected $entityValuesSample2 = [
        'id' => 2,
        'siteId' => 1,
        'title' => '会社概要',
        'pathname' => 'company',
        'isIndex' => 0,
        'isPublished' => false,
    ];

    protected $siteData = [
        'id' => 1,
        'site_name' => 'ほげほげ',
        'domain' => 'hoge.com',
        'font_size' => 1,
        'color_theme' => 'blue_1',
        'logo_image' => 'aa',
        'is_published' => 1,
    ];

    protected function setUp(): void
    {
        parent::setUp();
        $this->target = new PageRepository();
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
        DB::table('sites')->insert($this->siteData);
        DB::table('pages')->truncate();
        DB::table('pages')->insert($this->modelValuesSample1);
    }

    protected function getSiteModel()
    {
        $model = new PageModel();
        return $model->where('id', 1)->first();
    }

    protected function getSiteModels()
    {
        $model = new PageModel();
        return $model->get();
    }

    /**
     * @test
     */
    public function find()
    {
        $method = $this->getMethod('find');
        $ret = $method->invoke($this->target, 1);
        $this->assertInstanceOf(Page::class, $ret);
        $this->assertTrue($ret->has('siteId'));
        $this->assertTrue($ret->has('title'));
        $this->assertTrue($ret->has('pathname'));
        $this->assertTrue($ret->has('isIndex'));
        $this->assertTrue($ret->has('isPublished'));
    }

    /**
     * @test
     */
    public function regist()
    {
        $model = new Page();
        $model->fill($this->entityValuesSample2);

        $method = $this->getMethod('regist');
        $ret = $method->invoke($this->target, $model);
        $this->assertTrue(is_int($ret));

        $ret = $this->target->find(2);
        $this->assertEquals($ret->toArray(), $this->entityValuesSample2);
    }

    /**
     * @test
     */
    public function update()
    {
        $model = new Page();
        $model->fill([
            'id' => 1,
            'title' => 'トップ',
        ]);

        $method = $this->getMethod('update');
        $ret = $method->invoke($this->target, $model);

        $ret = $this->target->find(1);
        $this->assertEquals($ret->getTitle(), 'トップ');

    }

    /**
     * @test
     */
    public function destroy()
    {
        $model = new Page();
        $model->fill([
            'id' => 1,
        ]);

        $method = $this->getMethod('destroy');
        $ret = $method->invoke($this->target, $model);

        $ret = $this->target->find(1);
        $this->assertNull($ret);
    }
    

}
