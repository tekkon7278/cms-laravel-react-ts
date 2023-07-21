<?php

namespace App\Http\Controllers\Resource;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use App\Http\Controllers\Controller;
use App\Entities;

/**
 * ページ情報APIコントローラー
 */
class PageController extends Controller
{
    /**
     * 特定サイトのページリスト取得
     *
     * @param integer $siteId
     * @return Collection
     */
    public function index(int $siteId, Request $request)
    {
        logger()->debug($request->all());
        $params = $this->paramsFromRequest($request);
        $params->put('siteId', $siteId);

        $service = $this->service('SiteService');
        $pages = $service->getSitePages($params);
        return $pages;
    }

    /**
     * 特定のページ情報取得
     *
     * @param integer $siteId
     * @param integer $id
     * @return Entities\Page
     */
    public function show(int $siteId, int $id)
    {
        $params = $this->paramsFromRequest();
        $params->put('siteId', $siteId);
        $params->put('pageId', $id);

        $service = $this->service('SiteService');
        $page = $service->getSitePage($params);
        return $page;
    }

    /**
     * ページ登録
     *
     * @param Request $request
     * @param integer $siteId
     * @return array
     */
    public function store(Request $request, int $siteId)
    {
        $params = $this->paramsFromRequest($request);
        $params->put('siteId', $siteId);

        $service = $this->service('SiteService');
        $validator = $service->validateCreatePage($params);
        if ($validator->fails()) {
            return $this->createValidateErrorResponse($validator);
        }
        $id = $service->createPage($params);

        return [
            'result' => true,
            'id' => $id,
        ];
    }

    /**
     * ページ情報更新
     *
     * @param Request $request
     * @param integer $siteId
     * @param integer $id
     * @return array
     */
    public function update(Request $request, int $siteId, int $id)
    {
        $params = $this->paramsFromRequest($request);
        $params->put('siteId', $siteId);
        $params->put('pageId', $id);

        $service = $this->service('SiteService');
        $validator = $service->validateUpdatePage($params);
        if ($validator->fails()) {
            return $this->createValidateErrorResponse($validator);
        }
        $result = $service->updatePage($params);
        return [
            'result' => $result,
        ];
    }

    /**
     * ページ削除
     *
     * @param integer $siteId
     * @param integer $id
     * @return array
     */
    public function destroy(int $siteId, int $id)
    {
        $params = $this->paramsFromRequest();
        $params->put('siteId', $siteId);
        $params->put('pageId', $id);

        $service = $this->service('SiteService');
        $result = $service->deletePage($params);

        return [
            'result' => $result,
        ];
    }

}
