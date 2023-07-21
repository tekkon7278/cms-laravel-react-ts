<?php

namespace Tests\Unit\Entities;

// use PHPUnit\Framework\TestCase;
use Tests\TestCase;
use ReflectionClass;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;
use App\Repositories\SiteRepository;
use App\Models\SiteModel;
use App\Entities\Site;

class SiteTest extends TestCase
{
    protected $siteData1 = [
        'id' => 1,
        'site_name' => 'ほげほげ',
        'domain' => 'hoge.com',
        'color_theme' => 'blue_1',
        'logo_image' => 'aa',
        'is_published' => 1,
    ];

    public static function setUpBeforeClass(): void
    {
    }
    
    protected function setUp(): void
    {
        parent::setUp();
        $this->insertTestData();
    }

    protected function tearDown(): void
    {
        parent::tearDown();
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
    public function validate()
    {
        $site = new Site();

        $site->setName('abc');
        $site->setDomain('abc.com');
        $validator = $site->validate();
        $this->assertTrue(!$validator->fails());

        $site->setName('abc123456789012345678901234567890');
        $validator = $site->validate();
        $this->assertTrue($validator->fails());

        $site->setName('ほげほげ');
        $validator = $site->validate();
        $this->assertTrue($validator->fails());
    }

}
