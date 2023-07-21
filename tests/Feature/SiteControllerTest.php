<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Facades\DB;

class SiteControllerTest extends TestCase
{
    protected $siteData1 = [
        'id' => 1,
        'site_name' => 'ほげほげ',
        'domain' => 'hoge.com',
        'color_theme' => 'blue_1',
        'logo_image' => 'aa',
        'is_published' => 1,

    ];
    protected $entityData1 = [
        'id' => 1,
        'name' => 'ほげほげ',
        'domain' => 'hoge.com',
        'colorTheme' => 'blue_1',
        'logoImage' => 'aa',
        'isPublished' => 1,
    ];

    protected function setUp(): void
    {
        parent::setUp();
        $this->insertTestData();
    }

    protected function insertTestData()
    {
        DB::table('sites')->truncate();
        DB::table('sites')->insert($this->siteData1);
    }

    /**
     * 
     * @test
     */
    public function index()
    {
        $response = $this->get('/api/sites');
        $response->assertStatus(200);
        $response->assertJsonIsArray();
        $response->assertJsonCount(1);
        $response->assertJson([$this->entityData1]);
    }

    /**
     * 
     * @test
     */
    public function show()
    {
        $response = $this->get('/api/sites/1');
        $response->assertStatus(200);
        $response->assertJsonIsObject();
        $response->assertJson($this->entityData1);
    }
}
