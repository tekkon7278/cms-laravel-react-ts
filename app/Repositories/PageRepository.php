<?php

namespace App\Repositories;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use App\Entities\EntityInterface;
use App\Entities\Page;
use App\Models\PageModel;
use App\Models\SiteModel;

class PageRepository extends AbstractRepository
{
    /**
     * Pageのモデルとエンティティの項目名変換マップ
     *
     * @var array
     */
    protected $keyMap = [
        'id' => 'id',
        'parent_id' => 'parentId',
        'site_id' => 'siteId',
        'is_show_title' => 'isShowTitle',
        'page_title' => 'title',
        'pathname' => 'pathname',
        'is_index' => 'isIndex',
        'is_published' => 'isPublished',
    ];

    /**
     * ページID指定でページ情報取得
     *
     * @param int $pageId
     * @return Page
     */
    public function find($pageId)
    {
        $pageRow = $this->buildGetPageContentsModel()
            ->where('P.id', $pageId)
            ->first();
        if ($pageRow === null) {
            return null;
        }
        $page = $this->createEntity('Page', $pageRow);
        return $page;
    }

    /**
     * ドメインとパス指定でページ情報取得
     *
     * @param string $domain
     * @param string $pathname
     * @return Page
     */
    public function findByUrl($domain, $pathname)
    {
        $pageRow = $this->buildGetPageContentsModel()
            ->where('S.domain', $domain)
            ->where('P.pathname', $pathname)
            ->first();
        if ($pageRow === null) {
            return null;
        }
        $page = $this->createEntity('Page', $pageRow);
        return $page;
    }

    /**
     * ドメイン指定でindexページ情報取得
     *
     * @param string $domain
     * @return Page
     */
    public function findIndexByUrl($domain)
    {
        $pageRow = $this->buildGetPageContentsModel()
            ->where('S.domain', $domain)
            ->where('P.is_index', 1)
            ->first();
        if ($pageRow === null) {
            return null;
        }
        $page = $this->createEntity('Page', $pageRow);
        return $page;
    }

    /**
     * サイトID指定でページリスト情報取得
     *
     * @param int $siteId
     * @return Collection
     */
    public function findBySiteId($siteId)
    {
        $pageRows = $this->buildGetPageContentsModel()
            ->where('P.site_id', $siteId)
            ->orderBy('sort')
            ->get();
        $pages = $this->createEntityCollection('Page', $pageRows);
        return $pages;
    }

    /**
     * サイトID指定でページリスト情報取得
     *
     * @param int $siteId
     * @return Collection
     */
    public function findBySiteIdAndPublished($siteId)
    {
        $pageRows = $this->buildGetPageContentsModel()
            ->where('P.site_id', $siteId)
            ->where('P.is_published', 1)
            ->orderBy('sort')
            ->get();
        $pages = $this->createEntityCollection('Page', $pageRows);
        return $pages;
    }

    /**
     * サイトID指定でサイトのindexページ情報取得
     *
     * @param int $siteId
     * @return Page
     */
    public function findIndexBySiteId($siteId)
    {
        $pageRow = $this->buildGetPageContentsModel()
            ->where('P.site_id', $siteId)
            ->where('P.is_index', 1)
            ->first();
        if ($pageRow === null) {
            return null;
        }
        $page = $this->createEntity('Page', $pageRow);
        return $page;
    }

    /**
     * ページ情報取得用の定型モデル生成
     *
     * @return PageModel
     */
    private function buildGetPageContentsModel()
    {
        $pageModel = new PageModel();
        $siteModel = new SiteModel();

        return $pageModel
            ->from($pageModel->getTable() . ' AS P')
            ->join($siteModel->getTable(). ' AS S', "S.id", "=", "P.site_id")
            ->select('P.*', 'S.domain', DB::raw('S.is_published AND P.is_published AS is_published'));
    }

    /**
     * ページ登録
     *
     * @param Page $page
     * @return int
     */
    public function regist(EntityInterface $page)
    {
        // 並び順sort番号決定
        $sortNo = 1;
        if ($page->has('beforeId')) {
            $pageModel = new PageModel();
            $beforeSortNo = $pageModel
                ->where('id', $page->getBeforeId())
                ->value('sort');
            if ($beforeSortNo !== null) {
                $sortNo = ++$beforeSortNo;
            }
        }

        // 並び順差込位置以降のレコードのsort番号を一つずらす
        $pageModel = new PageModel();
        $pageModel
            ->where('site_id', $page->getSiteId())
            ->where('sort', '>=', $sortNo)
            ->increment('sort');

        // 登録
        $values = $this->getModelValuesFromEntity($page);
        $values['sort'] = $sortNo;
        $pageModel = new PageModel();
        $result = $pageModel->insertGetId($values);

        return $result;
    }

    /**
     * ページ情報更新
     *
     * @param Page $page
     * @return int
     */
    public function update(EntityInterface $page)
    {
        $values = $this->getModelValuesFromEntity($page);        
        if (count($values) === 0) {
            return true;
        }
        $pageModel = new PageModel();
        $result = $pageModel
            ->where('id', $page->getId())
            ->update($values);
            
        return $result;
    }

    /**
     * ページ削除
     *
     * @param Page $page
     * @return int
     */
    public  function destroy(EntityInterface $page)
    {
        $pageModel = new PageModel();
        $result = $pageModel
            ->where('id', $page->getId())
            ->delete();

        return $result;
    }
}