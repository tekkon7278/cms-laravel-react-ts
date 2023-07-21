<?php

namespace Tests\Unit\Entities;

// use PHPUnit\Framework\TestCase;
use Tests\TestCase;
use ReflectionClass;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;
use App\Repositories\SiteRepository;
use App\Models\SiteModel;
use App\Entities\AbstractEntity;

class EntityTest extends TestCase
{
    // use RefreshDatabase;

    protected $target;
    protected $reflection;

    protected $properties = [
        'name' => [
            'rule' => [
                'required',
                'max:30',
                'unique:sites,site_name,{id},id,is_published,{isPublished}',
            ],
        ],
        'parentId'=> [],
        'address' => [
            'rule' => [
                'required',
            ],
        ],
        'tel' => [],
        'isCompany' => [
            'type' => 'boolean'
        ],
        'isPublished' => [],
    ];

    protected $data1 = [
        'name' => 'ほげ',
        'address' => '日本東京',
        'tel' => '090-9999-9999',
        'isCompany' => false,
        'isPublished' => 1,
    ];

    protected $ngData = [
        'name' => 'name123456789012345678901234567890',
        'address' => '',
        'tel' => '',
        'isCompany' => false,
    ];


    public static function setUpBeforeClass(): void
    {
    }
    
    protected function setUp(): void
    {
        parent::setUp();
        $this->target = new class() extends AbstractEntity{};
        $this->reflection = new ReflectionClass($this->target);
        
        $propertiesProperty = $this->reflection->getProperty('properties');
        $propertiesProperty->setAccessible(true);
        $propertiesProperty->setValue($this->target, $this->properties);
    }

    protected function tearDown(): void
    {
        parent::tearDown();
    }

    protected function getMethod($name)
    {
        $method = $this->reflection->getMethod($name);
        $method->setAccessible(true);
        return $method;
    }

    /**
     * 
     * @test
     */
    public function _get()
    {
        $this->target->exchangeArray($this->data1);
        $ret = $this->getMethod('get')->invoke($this->target, 'name');

        $this->assertEquals($ret, $this->data1['name']);
    }

    /**
     * 
     * @test
     */
    public function set()
    {
        $this->target->exchangeArray($this->data1);

        $key = 'address';
        $value = '京都府京都市';
        $ret = $this->getMethod('set')->invoke($this->target, $key, $value);
        
        $this->assertTrue($ret === $this->target);
        $this->assertEquals($this->target[$key], $value);
    }

    /**
     * 
     * @test
     */
    public function fill()
    {
        $values = [
            'name' => 'ふが社',
            'address' => '京都府',
            'tel' => '075-999-9999',
            'isCompany' => true,
        ];
        $ret = $this->getMethod('fill')->invoke($this->target, $values);

        $this->assertTrue($ret === $this->target);
        $this->assertEquals($this->target->getArrayCopy(), $values);
    }

    /**
     * 
     * @test
     */
    public function getValidateRules1()
    {
        $ret = $this->getMethod('getValidateRules')->invoke($this->target);
        $this->assertEquals($ret, [
            'name' => [                
                'required',
                'max:30',
                'unique:sites,site_name,,id,is_published,',
            ],
            'address' => [
                'required',
            ],
        ]);
        
        $this->target->fill([
            'id' => 1,
            'isPublished' => 1,
        ]);
        $ret = $this->getMethod('getValidateRules')->invoke($this->target);
        $this->assertEquals($ret, [
            'name' => [                
                'required',
                'max:30',
                'unique:sites,site_name,1,id,is_published,1',
            ],
            'address' => [
                'required',
            ],
        ]);
    }

    /**
     * 
     * @test
     */
    public function validate1()
    {        
        $this->target->fill([
            'name' => 'name123456789012345678901234567890',
            'address' => '',
            'tel' => '',
            'isCompany' => false,
            'isPublished' => 1,
        ]);
        $ret = $this->getMethod('validate')->invoke($this->target);
        $this->assertTrue($ret instanceof \Illuminate\Validation\Validator);
        $this->assertCount(2, $ret->getRules());

    }


    /**
     * 
     * @test
     */
    public function validate2()
    {
        $this->target->fill([
            'name' => 'name123456789012345678901234567890',
        ]);
        $ret = $this->getMethod('validate')->invoke($this->target);
        $this->assertTrue($ret instanceof \Illuminate\Validation\Validator);
        $this->assertCount(1, $ret->getRules());
    }
        
    /**
     * 
     * @test
     */
    public function validate3()
    {        
        $this->target->fill([
            'name' => 'name123456789012345678901234567890',
        ]);
        $ret = $this->getMethod('validateAll')->invoke($this->target);
        $this->assertTrue($ret instanceof \Illuminate\Validation\Validator);
        $this->assertCount(2, $ret->getRules());
        
    }

    /**
     * 
     * @test
     */
    public function validate4()
    {
        DB::table('sites')->truncate();
        DB::table('sites')->insert([
            'id' => 1,
            'site_name' => 'テストサイト',
            'domain' => 'aaa.com',
            'is_published' => 1,
        ]);
        DB::table('sites')->insert([
            'id' => 2,
            'site_name' => 'テストサイト2',
            'domain' => 'aaa2.com',
            'is_published' => 0,
        ]);
        
        $this->target->fill([
            'id' => 1,
            'name' => 'さいと',
        ]);

        $ret = $this->getMethod('validate')->invoke($this->target);
        $this->assertTrue($ret instanceof \Illuminate\Validation\Validator); 
        $this->assertCount(0, $ret->errors()->all());
        
        $this->target->fill([
            'id' => 1,
            'name' => 'テストサイト',
        ]);
        $ret = $this->getMethod('validate')->invoke($this->target);        
        $errors = $ret->errors()->all();
        $this->assertCount(0, $ret->errors()->all());
        
        $this->target->fill([
            'id' => 3,
            'name' => 'テストサイト',
            'isPublished' => 1,
        ]);
        $ret = $this->getMethod('validate')->invoke($this->target);        
        $errors = $ret->errors()->all();
        $this->assertCount(1, $errors);
        
        $this->target->fill([
            'id' => 3,
            'name' => 'テストサイト2',
            'isPublished' => 1,
        ]);
        $ret = $this->getMethod('validate')->invoke($this->target);        
        $errors = $ret->errors()->all();
        $this->assertCount(0, $errors);
    }
    
    /**
     * 
     * @test
     */
    public function setId()
    {
        $value = 10;
        $ret = $this->getMethod('setId')->invoke($this->target, $value);

        $this->assertTrue($ret === $this->target);
        $this->assertEquals($ret['id'], $value);
    }

    protected function cast()
    {

    }

    public function preSet()
    {

    }

    public function postSet()
    {

    }

    public function hasId()
    {

    }

    public function has()
    {

    }

    public function isDefined()
    {

    }

    public function toArray()
    {
        $method = $this->getMethod('toArray');
        $ret = $method->invoke($this->target);

    }
}
