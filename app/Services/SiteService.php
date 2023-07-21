<?php

namespace App\Services;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Validator;
use App\Repositories;
use App\Entities;

/**
 * Webサイト情報関係Serviceクラス
 */
class SiteService extends AbstractService
{
    /**
     * サイトリポジトリクラスのインスタンス取得
     *
     * @return Repositories\SiteRepository
     */
    protected function makeSiteRepository()
    {
        return $this->repository('SiteRepository');
    }

    /**
     * ページリポジトリクラスのインスタンス取得
     *
     * @return Repositories\PageRepository
     */
    protected function makePageRepository()
    {
        return $this->repository('PageRepository');
    }

    /**
     * コンテンツリポジトリクラスのインスタンス生成
     *
     * @return Repositories\ContentRepository
     */
    protected function makeContentRepository()
    {
        return $this->repository('ContentRepository');
    }

    /**
     * Siteエンティティ生成
     *
     * @param Collection $params
     * @return Entities\Site
     */
    protected function makeSiteEntity(Collection $params)
    {
        $site = $this->entity('Site');
        if ($params->has('siteId')) {
            $site->setId($params->get('siteId'));
        }
        if ($params->has('name')) {
            $site->setName($params->get('name'));
        }
        if ($params->has('domain')) {
            $site->setDomain($params->get('domain'));
        }
        if ($params->has('logoImage')) {
            $site->setLogoImage($params->get('logoImage'));
        }
        if ($params->has('colorTheme')) {
            $site->setColorTheme($params->get('colorTheme'));
        }
        if ($params->has('elementSpace')) {
            $site->setElementSpace($params->get('elementSpace'));
        }
        if ($params->has('isPublished')) {
            $site->setIsPublished($params->get('isPublished'));
        }
        return $site;
    }

    /**
     * Pageエンティティ生成
     *
     * @param Collection $params
     * @return Entities\Page
     */
    protected function makePageEntity(Collection $params)
    {
        $page = $this->entity('Page');       
        if ($params->has('pageId')) {
            $page->setId($params->get('pageId'));
        }
        if ($params->has('siteId')) {
            $page->setSiteId($params->get('siteId'));
        }
        if ($params->has('isShowTitle')) {
            $page->setIsShowTitle($params->get('isShowTitle'));
        }
        if ($params->has('title')) {
            $page->setTitle($params->get('title'));
        }
        if ($params->has('pathname')) {
            $page->setPathname($params->get('pathname'));
        }
        if ($params->has('beforePageId')) {
            $page->setBeforeId($params->get('beforePageId'));
        }
        if ($params->has('isPublished')) {
            $page->setIsPublished($params->get('isPublished'));
        }
        return $page;
    }

    /**
     * Contentエンティティ生成
     *
     * @param Collection $params
     * @return Entities\Content\Content
     */
    protected function makeContentEntity(Collection $params)
    {
        $contentFactory = $this->entity('ContentFactory');
        $content = null;
        if ($params->has('type')) {
            $content = $contentFactory->provideFromType($params->get('type'));
        } elseif ($params->has('contentId')) {
            $content = $this->getPageContent($params);
        }

        if ($params->has('contentId')) {
            $content->setId($params->get('contentId'));
        }
        if ($params->has('pageId')) {
            $content->setPageId($params->get('pageId'));
        }
        if ($params->has('type')) {
            $content->setType($params->get('type'));
        }
        if ($params->has('value')) {
            $content->setValue($params->get('value'));
        }
        if ($params->has('padding')) {
            $content->setPadding($params->get('padding'));
        }
        if ($params->has('beforeContentId')) {
            $content->setBeforeId($params->get('beforeContentId'));
        }
        if ($params->has('parentContentId') && is_int($params->get('parentContentId'))) {
            $content->setParentId($params->get('parentContentId'));
        }
        if ($params->has('isPublished')) {
            $content->setIsPublished($params->get('isPublished'));
        }
        return $content;
    }

    /**
     * サイトリスト取得
     *
     * @return Collection
     */
    public function getSiteList()
    {
        return  $this->makeSiteRepository()->findAll();
    }

    /**
     * 特定サイト情報取得
     *
     * @param Collection $params
     * @return Entities\Site
     */
    public function getSite(Collection $params)
    {
        return  $this->makeSiteRepository()->find($params->get('siteId'));
    }

    /**
     * サイト登録バリデーション
     *
     * @param Collection $params
     * @return Validator
     */
    public function validateCreateSite(Collection $params)
    {
        return $this->makeSiteEntity($params)->validate();
    }

    /**
     * サイト登録
     *
     * @param Collection $params
     * @return int 登録されたサイトのID
     */
    public function createSite(Collection $params)
    {
        try {
            $this->beginTransaction();
    
            $site = $this->makeSiteEntity($params);
            $site->setColorTheme('blue_2');
            $site->setFontSize(1);
            $siteId = $this->makeSiteRepository()->regist($site);
    
            $homePage = $this->makePageEntity($params);
            $homePage->setSiteId($siteId);
            $homePage->setIsIndex(true);
            $homePage->setIsPublished(true);
            $homePage->setTitle('ホーム');
            $this->makePageRepository()->regist($homePage);

            $this->commit();
            return $siteId;

        } catch (\Exception $e) {
            $this->rollback();
            throw $e;
        }
    }


    /**
     * サイト情報更新のバリデーション
     *
     * @param Collection $params
     * @return Validator
     */
    public function validateUpdateSite(Collection $params)
    {
        return $this->makeSiteEntity($params)->validate();
    }

    /**
     * サイト情報更新
     *
     * @param Collection $params
     * @return boolean
     */
    public function updateSite(Collection $params)
    {
        try {
            $this->beginTransaction();

            $site = $this->makeSiteEntity($params);
            $result = $this->makeSiteRepository()->update($site);

            $this->commit();
            return $result;

        } catch (\Exception $e) {
            $this->rollback();
            throw $e;
        }
    }

    /**
     * サイト削除
     *
     * @param Collection $params
     * @return boolean
     */
    public function deleteSite(Collection $params)
    {
        try {
            $this->begin();

            $site = $this->makeSiteEntity($params);
            $result = $this->makeSiteRepository()->destroy($site);
            
            $this->commit();
            return $result;

        } catch (\Exception $e) {
            $this->rollback();
            throw $e;
        }
    }
    
    /**
     * 特定サイトのページリスト情報取得
     *
     * @param Collection $params
     * @return Collection
     */
    public function getSitePages(Collection $params)
    {
        logger()->debug($params->has('isPublished'));
        if ($params->has('isPublished') && $params->get('isPublished') == 1) {
            return $this->makePageRepository()->findBySiteIdAndPublished($params->get('siteId'));
        } else {
            return $this->makePageRepository()->findBySiteId($params->get('siteId'));
        }
    }
    
    /**
     * 特定のページ情報取得
     *
     * @param Collection $params
     * @return Entities\Site
     */
    public function getSitePage(Collection $params)
    {
        $pageRepo = $this->makePageRepository();
        if (!$params->has('pageId')) {
            return $pageRepo->findIndexBySiteId($params->get('siteId'));
        } else {
            return $pageRepo->find($params->get('pageId'));
        }
    }
    
    /**
     * URLからページ情報取得
     *
     * @param Collection $params
     * @return Entities\Page
     */
    public function getPageFromUrl(Collection $params)
    {
        if ($params->get('pathname') == '' || $params->get('pathname') == '/') {
            return $this->makePageRepository()->findIndexByUrl(
                $params->get('domain')
            );

        } else {
            return $this->makePageRepository()->findByUrl(
                $params->get('domain'),
                $params->get('pathname')
            );
        }
    }

    /**
     * ページ追加
     *
     * @param Collection $params
     * @return int
     */
    public function createPage(Collection $params)
    {
        try {
            $this->begin();

            $page = $this->makePageEntity($params);
            $page->setIsIndex(false);
            $id = $this->makePageRepository()->regist($page);

            $this->commit();
            return $id;
            
        } catch (\Exception $e) {
            $this->rollback();
            throw $e;
        }
    }

    /**
     * ページ追加のバリデーション
     *
     * @param Collection $params
     * @return Validator
     */
    public function validateCreatePage(Collection $params)
    {
        return $this->makePageEntity($params)->validate();
    }

    /**
     * ページ情報更新
     *
     * @param Collection $params
     * @return boolean
     */
    public function updatePage(Collection $params)
    {
        try {
            $this->begin();

            $page = $this->makePageEntity($params);
            $result = $this->makePageRepository()->update($page);

            $this->commit();
            return $result;
            
        } catch (\Exception $e) {
            $this->rollback();
            throw $e;
        }
    }

    /**
     * ページ情報更新のバリデーション
     *
     * @param Collection $params
     * @return Validator
     */
    public function validateUpdatePage(Collection $params)
    {
        return $this->makePageEntity($params)->validate();
    }

    /**
     * ページ削除
     *
     * @param Collection $params
     * @return boolean
     */
    public function deletePage(Collection $params)
    {
        try {
            $this->begin();

            $page = $this->makePageEntity($params);
            $result = $this->makePageRepository()->destroy($page);
            
            $this->commit();
            return $result;
            
        } catch (\Exception $e) {
            $this->rollback();
            throw $e;
        }
    }
    
    /**
     * 特定ページのコンテンツリスト取得
     *
     * @param Collection $params
     * @return Collection
     */
    public function getPageContents(Collection $params)
    {
        return $this->makeContentRepository()->findByPageId($params->get('pageId'));
    }
    
    /**
     * 特定コンテンツの情報取得
     *
     * @param Collection $params
     * @return Entities\Content\Content
     */
    public function getPageContent(Collection $params)
    {
        return $this->makeContentRepository()->find($params->get('contentId'));
    }

    /**
     * コンテンツの登録
     *
     * @param Collection $params
     * @return int
     */
    public function createPageContent(Collection $params)
    {
        try {
            $this->begin();

            $content = $this->makeContentEntity($params);
            $id = $this->makeContentRepository()->regist($content);
            
            $this->commit();
            return $id;
            
        } catch (\Exception $e) {
            $this->rollback();
            throw $e;
        }
    }

    /**
     * コンテンツ登録のバリデーション
     *
     * @param Collection $params
     * @return Validator
     */
    public function validateCreatePageContent(Collection $params)
    {
        return $this->makeContentEntity($params)->validate();
    }
    
    /**
     * コンテンツ情報の更新
     *
     * @param Collection $params
     * @return boolean
     */
    public function updatePageContent(Collection $params)
    {
        try {
            $this->begin();

            $content = $this->makeContentEntity($params);
            $result = $this->makeContentRepository()->update($content);
            
            $this->commit();
            return $result;
            
        } catch (\Exception $e) {
            $this->rollback();
            throw $e;
        }
    }

    /**
     * コンテンツ情報更新のバリデーション
     *
     * @param Collection $params
     * @return Validator
     */
    public function validateUpdatePageContent(Collection $params)
    {
        return $this->makeContentEntity($params)->validate();
    }

    /**
     * コンテンツ削除
     *
     * @param Collection $params
     * @return boolean
     */
    public function destroyPageContent(Collection $params)
    {
        try {
            $this->begin();

            $content = $this->makeContentEntity($params);
            $result = $this->makeContentRepository()->destroy($content);
            
            $this->commit();
            return $result;
            
        } catch (\Exception $e) {
            $this->rollback();
            throw $e;
        }
    }

}