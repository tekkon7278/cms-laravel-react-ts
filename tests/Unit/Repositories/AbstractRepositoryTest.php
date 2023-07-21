<?php

namespace Tests\Unit\Repositories;

// use PHPUnit\Framework\TestCase;
use Tests\TestCase;
use ReflectionClass;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;
use App\Repositories\AbstractRepository;
use App\Models\SiteModel;
use App\Entities\Site;
use App\Entities\EntityInterface;

class AbstractRepositoryTest extends TestCase
{
    // use RefreshDatabase;

    protected $target;
    protected $reflection;

    protected $modelValuesSample1 = [
        'id' => 1,
        'site_name' => 'ほげほげ',
        'domain' => 'hoge.com',
        'color_theme' => 'blue_1',
        'logo_image' => 'aa',
        'is_published' => 1,
    ];

    protected $modelValuesSample2 = [
        'id' => 2,
        'site_name' => 'ふがふが',
        'domain' => 'fuga.com',
        'color_theme' => 'red_1',
        'logo_image' => 'dddd',
        'is_published' => 0,
    ];

    protected $entityValuesSample1 = [
        'id' => 1,
        'name' => 'ほげほげ',
        'domain' => 'hoge.com',
        'colorTheme' => 'blue_1',
        'logoImage' => 'aa',
        'isPublished' => 1,
    ];

    protected $keyMap = [
        'id' => 'id',
        'site_name' => 'name',
        'domain' => 'domain',
        'logo_image' => 'logoImage',
        'font_size' => 'fontSize',
        'color_theme' => 'colorTheme',
        'is_published' => 'isPublished',
    ];

    protected $foreignMap = [
    ];

    protected $valueMap = [
    ];
    
    protected function setUp(): void
    {
        parent::setUp();
        $this->target = new class() extends AbstractRepository{
            public function find($id){}
            public function regist(EntityInterface $entity){}     
            public function update(EntityInterface $entity){}   
            public function destroy(EntityInterface $entity){}
        };
        $this->reflection = new ReflectionClass($this->target);
        
        $propertiesProperty = $this->reflection->getProperty('keyMap');
        $propertiesProperty->setAccessible(true);
        $propertiesProperty->setValue($this->target, $this->keyMap);

        $propertiesProperty = $this->reflection->getProperty('foreignMap');
        $propertiesProperty->setAccessible(true);
        $propertiesProperty->setValue($this->target, $this->keyMap);

        $propertiesProperty = $this->reflection->getProperty('valueMap');
        $propertiesProperty->setAccessible(true);
        $propertiesProperty->setValue($this->target, $this->valueMap);

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
        DB::table('sites')->insert($this->modelValuesSample2);
    }

    protected function deleteTestData()
    {
        DB::table('sites')->truncate();
    }

    protected function getSiteModel()
    {
        $model = new SiteModel();
        return $model->where('id', 1)->first();
    }

    protected function getSiteModels()
    {
        $model = new SiteModel();
        return $model->get();
    }

    /**
     * @test
     */
    public function exchangeModelKeys()
    {
        $method = $this->getMethod('exchangeModelValues');
        $ret = $method->invoke($this->target, $this->modelValuesSample1);
        $this->assertEquals($ret, $this->entityValuesSample1);
    }

    /**
     * @test
     */
    public function exchangeEntityKeys()
    {
        $method = $this->getMethod('exchangeEntityValues');
        $ret = $method->invoke($this->target, $this->entityValuesSample1);
        $this->assertEquals($ret, $this->modelValuesSample1);
    }

    /**
     * @test
     */
    public function createEntity()
    {
        $model = $this->getSiteModel();
        $method = $this->getMethod('createEntity');
        $ret = $method->invoke($this->target, 'Site', $model);
        $this->assertTrue($ret instanceof Site);
        $this->assertTrue($ret->has('name'));
        $this->assertTrue($ret->has('domain'));
        $this->assertTrue($ret->has('colorTheme'));
        $this->assertTrue($ret->has('logoImage'));
        $this->assertTrue($ret->has('isPublished'));
    }

    /**
     * @test
     */
    public function createEntityCollection()
    {
        $models = $this->getSiteModels();
        $method = $this->getMethod('createEntityCollection');
        $ret = $method->invoke($this->target, 'Site', $models);
        $this->assertTrue($ret instanceof Collection);
        $this->assertTrue($ret[0] instanceof Site);
    }

    /**
     * @test
     */
    public function getModelValuesFromEntity()
    {
        $model = new Site();
        $model->fill($this->entityValuesSample1);
        $method = $this->getMethod('getModelValuesFromEntity');
        $ret = $method->invoke($this->target, $model);
        $this->assertTrue(is_array($ret));
        $this->assertEquals($ret, $this->modelValuesSample1);
    }

}
