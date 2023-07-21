<?php

namespace Tests\Unit;

// use PHPUnit\Framework\TestCase;
use Tests\TestCase;
use ReflectionClass;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;
use App\Repositories\ContentRepository;
use App\Models\ContentModel;
use App\Models\PageModel;
use App\Entities\Content\TextContent;
use App\Entities\Content\TitleContent;
use App\Entities\Content\ImageContent;
use App\Entities\Content\ColumnsLayout;

class ContentRepositoryTest extends TestCase
{
    protected $target;
    protected $reflection;

    protected $pageData = [
        'id' => 2,
        'site_id' => 3,
        'pathname' => 'hoge',
        'page_title' => 'タイトル',
        'sort' => 1,
    ];

    protected $contentDatas = [
        [
            'id' => 1,
            'page_id' => 2,
            'site_id' => 3,
            'content_type' => 1,
            'content_title' => 'hogehgoe',
            'content' => 'fugafuga',
            'is_published' => 1,
        ],
        [
            'id' => 2,
            'page_id' => 2,
            'site_id' => 3,
            'content_type' => 6,
            'content_title' => 'image.jpg',
            'binary_content' => 'This is image binary',
            'is_published' => 1,
        ],
        [
            'id' => 3,
            'page_id' => 2,
            'site_id' => 3,
            'content_type' => 99,
            'content_title' => null,
            'content' => null,
            'is_published' => 1,
        ],
        [
            'id' => 4,
            'parent_id' => 3,
            'page_id' => 2,
            'site_id' => 3,
            'content_type' => 1,
            'content_title' => null,
            'content' => 'columns inner content 1.',
            'is_published' => 1,
        ],
        [
            'id' => 5,
            'parent_id' => 3,
            'page_id' => 2,
            'site_id' => 3,
            'content_type' => 2,
            'content_title' => null,
            'content' => 'This is title.',
            'is_published' => 1,
        ],
    ];

    protected $entityValuesSample1 = [
        'id' => 1,
        'pageId' => 2,
        'siteId' => 3,
        'type' => 'text',
        'title' => 'hogehgoe',
        'value' => 'fugafuga',
        'isPublished' => 1,

    ];

    protected function setUp(): void
    {
        parent::setUp();
        $this->target = new ContentRepository();
        $this->reflection = new ReflectionClass($this->target);
        $this->insertTestData();
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

    protected function insertTestData()
    {
        $this->deleteTestData();
        
        DB::table('pages')->insert($this->pageData);

        foreach ($this->contentDatas as $data) {
            $tmpData = $data;
            unset($tmpData['site_id']);
            DB::table('contents')->insert($tmpData);
        }
        // DB::table('contents')->insert($this->modelValuesSample2);
    }

    protected function deleteTestData()
    {
        DB::table('contents')->truncate();
        DB::table('pages')->truncate();
    }

    protected function getModel()
    {
        $model = new ContentModel();
        $pageModel = new PageModel();
        return $model
            ->from($model->getTable() . ' AS C')
            ->join($pageModel->getTable(). ' AS P', "P.id", "=", "C.page_id")
            ->where('C.id', 1)
            ->select('C.*', 'P.site_id')
            ->first();
    }

    protected function getModels()
    {
        $model = new ContentModel();
        $pageModel = new PageModel();
        return $model
            ->from($model->getTable() . ' AS C')
            ->join($pageModel->getTable(). ' AS P', "P.id", "=", "C.page_id")
            ->select('C.*', 'P.site_id')
            ->get();
    }

    /**
     * @test
     */
    public function exchangeModelValues()
    {
        $method = $this->getMethod('exchangeModelValues');
        $ret = $method->invoke($this->target, $this->contentDatas[0]);
        $this->assertEquals($ret, $this->entityValuesSample1);
    }

    /**
     * @test
     */
    public function exchangeEntityValues()
    {
        $method = $this->getMethod('exchangeEntityValues');
        $ret = $method->invoke($this->target, $this->entityValuesSample1);
        $this->assertEquals($ret, $this->contentDatas[0]);
    }

    /**
     * @test
     */
    public function createEntity()
    {
        $model = $this->getModel();
        $method = $this->getMethod('createEntity');
        $ret = $method->invoke($this->target, 'ContentFactory', $model);
        $this->assertTrue($ret instanceof TextContent);
        $this->assertTrue($ret->has('pageId'));
        $this->assertTrue($ret->has('siteId'));
        $this->assertTrue($ret->has('type'));
        $this->assertTrue($ret->has('title'));
        $this->assertTrue($ret->has('value'));
        $this->assertTrue($ret->has('isPublished'));
    }

    /**
     * @test
     */
    public function createEntityCollection()
    {
        $models = $this->getModels();
        $method = $this->getMethod('createEntityCollection');
        $ret = $method->invoke($this->target, 'ContentFactory', $models);
        $this->assertTrue($ret instanceof Collection);
        $this->assertTrue($ret[0] instanceof TextContent);
    }

    /**
     * @test
     */
    public function getModelValuesFromEntity()
    {
        $model = new TextContent();
        $model->fill($this->entityValuesSample1);
        $method = $this->getMethod('getModelValuesFromEntity');
        $ret = $method->invoke($this->target, $model);
        $this->assertTrue(is_array($ret));
        $this->assertEquals($ret, $this->contentDatas[0]);
    }

    /**
     * @test
     */
    public function find()
    {
        $content1 = $this->getMethod('find')->invoke($this->target, $this->contentDatas[0]['id']);
        $content2 = $this->getMethod('find')->invoke($this->target, $this->contentDatas[1]['id']);
        
        $this->assertInstanceOf(TextContent::class, $content1);
        $this->assertEquals($content1->getPageId(), $this->contentDatas[0]['page_id']);
        $this->assertEquals($content1->getSiteId(), $this->contentDatas[0]['site_id']);
        $this->assertEquals($content1->getTitle(), $this->contentDatas[0]['content_title']);
        $this->assertEquals($content1->getValue(), $this->contentDatas[0]['content']);
        $this->assertEquals($content1->getIsPublished(), $this->contentDatas[0]['is_published']);

        $this->assertInstanceOf(ImageContent::class, $content2);
        $this->assertEquals($content2->getPageId(), $this->contentDatas[1]['page_id']);
        $this->assertEquals($content2->getSiteId(), $this->contentDatas[1]['site_id']);
        $this->assertEquals($content2->getTitle(), $this->contentDatas[1]['content_title']);
        $this->assertEquals($content2->getValue(), $this->contentDatas[1]['binary_content']);
        $this->assertEquals($content2->getIsPublished(), $this->contentDatas[1]['is_published']);

    }
    
    /**
     * @test
     */
    public function findByPageId()
    {
        $contents = $this->getMethod('findByPageId')->invoke($this->target, 2);

        $this->assertInstanceOf(Collection::class, $contents);
        $this->assertCount(3, $contents);

        $this->assertInstanceOf(TextContent::class, $contents[0]);
        $this->compareData($contents[0], $this->contentDatas[0]);
        $this->assertEquals($contents[0]->getValue(), $this->contentDatas[0]['content']);

        $this->assertInstanceOf(ImageContent::class, $contents[1]);
        $this->compareData($contents[1], $this->contentDatas[1]);
        $this->assertEquals($contents[1]->getValue(), $this->contentDatas[1]['binary_content']);

        $this->assertInstanceOf(ColumnsLayout::class, $contents[2]);
        $this->compareData($contents[2], $this->contentDatas[2]);
        $this->assertInstanceOf(Collection::class, $contents[2]->getValue());
        $this->assertCount(2, $contents[2]->getValue());

        $columns = $contents[2]->getValue();
        $this->assertCount(2, $columns);

        $this->assertInstanceOf(TextContent::class, $columns[0]);
        $this->compareData($columns[0], $this->contentDatas[3]);
        $this->assertEquals($columns[0]->getValue(), $this->contentDatas[3]['content']);
        
        $this->assertInstanceOf(TitleContent::class, $columns[1]);
        $this->compareData($columns[1], $this->contentDatas[4]);
        $this->assertEquals($columns[1]->getValue(), $this->contentDatas[4]['content']);
    }

    /**
     * @test
     */
    public function findChildrenById()
    {
        $contents = $this->getMethod('findChildrenById')->invoke($this->target, 3);
        
        $this->assertInstanceOf(Collection::class, $contents);
        $this->assertCount(2, $contents);

        $this->assertInstanceOf(TextContent::class, $contents[0]);
        $this->compareData($contents[0], $this->contentDatas[3]);
        $this->assertEquals($contents[0]->getValue(), $this->contentDatas[3]['content']);

        $this->assertInstanceOf(TitleContent::class, $contents[1]);
        $this->compareData($contents[1], $this->contentDatas[4]);
        $this->assertEquals($contents[1]->getValue(), $this->contentDatas[4]['content']);

    }

    protected function compareData($content, $compare)
    {
        $this->assertEquals($content->getPageId(), $compare['page_id']);
        $this->assertEquals($content->getSiteId(), $compare['site_id']);
        $this->assertEquals($content->getTitle(), $compare['content_title']);
        $this->assertEquals($content->getIsPublished(), $compare['is_published']);
    }
    
}
