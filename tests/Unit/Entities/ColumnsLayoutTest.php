<?php

namespace Tests\Unit\Entities;

// use PHPUnit\Framework\TestCase;
use Tests\TestCase;
use ReflectionClass;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;
use App\Entities\Content\ColumnsLayout;

class ColumnsLayoutTest extends TestCase
{
    protected $data1 = [
        'id' => 1,
        'pageId' => 1,
        'siteId' => 1,
        'type' => 'columns',
        'value' => [
            'text',
            'title',
        ],
        'isPublished' => 1,
    ];

    protected $pageData1 = [
        'id' => 1,
        'siteId' => 1,
        'title' => 'HOME',
        'pathname' => 'home',
        'isIndex' => 1,
        'isPublished' => true,
    ];
    
    protected $siteData1 = [
        'id' => 1,
        'name' => 'ほげほげ',
        'domain' => 'hoge.com',
        'fontSize' => 1,
        'colorTheme' => 'blue_1',
        'logoImage' => 'aa',
        'isPublished' => true,
    ];

    protected function setUp(): void
    {
        parent::setUp();
        // $this->insertTestData();
    }

    protected function insertTestData()
    {
        DB::table('contents')->truncate();
        DB::table('pages')->truncate();
        DB::table('sites')->truncate();
        
        DB::table('sites')->insert($this->siteData1);
        DB::table('pages')->insert($this->pageData1);
        DB::table('contents')->insert($this->data1);
    }

    /**
     * 
     * @test
     */
    public function setValue1()
    {
        $entity = new ColumnsLayout();
        $entity->setValue($this->data1['value']);

        $collection = $entity->getValue();
        $this->assertInstanceOf(Collection::class, $collection);
        $this->assertEquals($this->data1['value'][0], $collection[0]->getType());
        $this->assertEquals($this->data1['value'][1], $collection[1]->getType());
    }

    /**
     * 
     * @test
     */
    public function setValue2()
    {
        $entity = new ColumnsLayout();
        $entity->fill($this->data1);

        $collection = $entity->getValue();
        $this->assertInstanceOf(Collection::class, $collection);
    }

}
