<?php

namespace App\Http\Controllers\Resource;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use App\Http\Controllers\Controller;
use App\Entities;

/**
 * コンテンツ情報APIコントローラー
 */
class ContentController extends Controller
{
    /**
     * 特定ページのコンテンツリスト取得
     *
     * @param int $siteId
     * @param int $pageId
     * @return Collection
     */
    public function index(int $siteId, int $pageId)
    {
        $params = $this->paramsFromRequest();
        $params->put('siteId', $siteId);
        $params->put('pageId', $pageId);

        $service = $this->service('SiteService');
        return $service->getPageContents($params);
    }

    /**
     * 特定のコンテンツ情報取得
     *
     * @param int $siteId
     * @param int $pageId
     * @param int $id
     * @return Entities\Content\Content
     */
    public function show($siteId, $pageId, $id)
    {
        $params = $this->paramsFromRequest();
        $params->put('siteId', $siteId);
        $params->put('pageId', $pageId);
        $params->put('contentId', $id);

        $service = $this->service('SiteService');
        return $service->getPageContent($params);
    }

    /**
     * コンテンツ登録
     *
     * @param Request $request
     * @param integer $siteId
     * @param integer $pageId
     * @return array
     */
    public function store(Request $request, int $siteId, int $pageId)
    {
        $params = $this->paramsFromRequest($request);
        $params->put('siteId', $siteId);
        $params->put('pageId', $pageId);

        $service = $this->service('SiteService');
        $validator = $service->validateCreatePageContent($params);
        if ($validator->fails()) {
            return $this->createValidateErrorResponse($validator);
        }
        $id = $service->createPageContent($params);
        return [
            'result' => true,
            'id' => $id,
        ];
    }

    /**
     * コンテンツ更新
     *
     * @param Request $request
     * @param integer $siteId
     * @param integer $pageId
     * @param integer $id
     * @return array
     */
    public function update(Request $request, int $siteId, int $pageId, int $id)
    {
        $params = $this->paramsFromRequest($request);
        $params->put('contentId', $id);
        $params->put('pageId', $pageId);

        $service = $this->service('SiteService');
        $validator = $service->validateUpdatePageContent($params);
        if ($validator->fails()) {
            return $this->createValidateErrorResponse($validator);
        }
        $result = $service->updatePageContent($params);
        return [
            'result' => $result
        ];
    }

    /**
     * コンテンツ削除
     *
     * @param integer $siteId
     * @param integer $pageId
     * @param integer $id
     * @return array
     */
    public function destroy(int $siteId, int $pageId, int $id)
    {
        $params = $this->paramsFromRequest();
        $params->put('contentId', $id);
        $params->put('pageId', $pageId);

        $service = $this->service('SiteService');
        $result = $service->destroyPageContent($params);
        return [
            'result' => $result
        ];
    }

}
