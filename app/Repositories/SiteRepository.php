<?php

namespace App\Repositories;

use App\Entities\EntityInterface;
use App\Entities\Site;
use App\Models\SiteModel;
use Illuminate\Support\Collection;

class SiteRepository extends AbstractRepository
{
    /**
     * Siteのモデルとエンティティの項目名変換マップ
     *
     * @var array
     */
    protected $keyMap = [
        'id' => 'id',
        'site_name' => 'name',
        'domain' => 'domain',
        'logo_image' => 'logoImage',
        'font_size' => 'fontSize',
        'element_space' => 'elementSpace',
        'color_theme' => 'colorTheme',
        'is_published' => 'isPublished',
    ];

    /**
     * サイトリスト情報取得
     *
     * @return Collection
     */
    public function findAll()
    {
        $siteModel = new SiteModel();
        $siteRows = $siteModel
            ->orderBy('sort')
            ->get();

        $entities = $this->createEntityCollection('Site', $siteRows);
        return $entities;
    }

    /**
     * サイトID指定でサイト情報取得
     *
     * @param int $siteId
     * @return Site
     */
    public function find($siteId)
    {
        $siteModel = new SiteModel();
        $siteRow = $siteModel
            ->where('id', $siteId)
            ->first();
        if ($siteRow === null) {
            return null;
        }
        $entity = $this->createEntity('Site', $siteRow);
        return $entity;
    }

    /**
     * サイト登録
     *
     * @param Site $site
     * @return int
     */
    public  function regist(EntityInterface $site)
    {
        $values = $this->getModelValuesFromEntity($site);

        $siteModel = new SiteModel();
        $id = $siteModel
            ->insertGetId($values);
        return $id;
    }

    /**
     * サイト情報更新
     *
     * @param Site $site
     * @return int
     */
    public function update(EntityInterface $site)
    {
        $values = $this->getModelValuesFromEntity($site);
        if (count($values) === 0) {
            return true;
        }

        $siteModel = new SiteModel();
        $result = $siteModel
            ->where('id', $site->getId())
            ->update($values);

        return $result;
        
    }

    /**
     * サイト削除
     *
     * @param Site $site
     * @return int
     */
    public  function destroy(EntityInterface $site)
    {
        $siteModel = new SiteModel();
        $result = $siteModel
            ->where('id', $site->getId())
            ->delete();
        return $result;
    }

}