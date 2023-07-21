<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Facades\DB;

class ContentControllerTest extends TestCase
{
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

    protected $entityDatas = [
        [
            'id' => 1,
            'pageId' => 2,
            'siteId' => 3,
            'type' => 'text',
            'title' => 'hogehgoe',
            'value' => 'fugafuga',
            'isPublished' => 1,
        ],
        [
            'id' => 2,
            'pageId' => 2,
            'siteId' => 3,
            'type' => 'image',
            'title' => 'image.jpg',
            'value' => 'This is image binary',
            'isPublished' => 1,
        ],
        [
            'id' => 3,
            'pageId' => 2,
            'siteId' => 3,
            'type' => 'columns',
            'title' => null,
            'value' => [
                [
                    'id' => 4,
                    'pageId' => 2,
                    'siteId' => 3,
                    'type' => 'text',
                    'title' => null,
                    'value' => 'columns inner content 1.',
                    'isPublished' => 1,
                ],
                [
                    'id' => 5,
                    'pageId' => 2,
                    'siteId' => 3,
                    'type' => 'title',
                    'title' => null,
                    'value' => 'This is title.',
                    'isPublished' => 1,
                ],
            ],
            'isPublished' => 1,
        ],
    ];


    protected function setUp(): void
    {
        parent::setUp();
        $this->insertTestData();
    }

    protected function insertTestData()
    {
        DB::table('contents')->truncate();
        DB::table('pages')->truncate();
        
        DB::table('pages')->insert($this->pageData);

        foreach ($this->contentDatas as $data) {
            $tmpData = $data;
            unset($tmpData['site_id']);
            DB::table('contents')->insert($tmpData);
        }
    }

    /**
     * 
     * @test
     */
    public function index()
    {
        $response = $this->get('/api/sites/3/pages/2/contents');
        $response->assertStatus(200);
        $response->assertJsonIsArray();
        $response->assertJsonCount(3);
        $response->assertJson($this->entityDatas);
    }

    /**
     * 
     * @test
     */
    public function show()
    {
        $response = $this->get('/api/sites/3/pages/2/contents/1');
        $response->assertStatus(200);
        $response->assertJsonIsObject();
        $response->assertJson($this->entityDatas[0]);

        $response = $this->get('/api/sites/3/pages/2/contents/2');
        $response->assertStatus(200);
        $response->assertJsonIsObject();
        $response->assertJson($this->entityDatas[1]);

    }
}
