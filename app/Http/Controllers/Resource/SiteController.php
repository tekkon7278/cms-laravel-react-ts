<?php

namespace App\Http\Controllers\Resource;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use App\Http\Controllers\Controller;
use App\Entities;

/**
 * サイト情報APIコントローラー
 */
class SiteController extends Controller
{
    /**
     * サイトリスト取得
     *
     * @return Collection
     */
    public function index()
    {
        $service = $this->service('SiteService');
        $sites = $service->getSiteList();
        return $sites;
    }

    /**
     * 特定のサイト情報取得
     *
     * @param integer $id
     * @return Entities\Site
     */
    public function show(int $id)
    {
        $params = $this->paramsFromRequest();
        $params->put('siteId', $id);
        
        $service = $this->service('SiteService');
        $site = $service->getSite($params);
        return $site;
    }

    /**
     * サイト登録
     *
     * @param Request $request
     * @return array
     */
    public function store(Request $request)
    {
        $params = $this->paramsFromRequest($request);

        $service = $this->service('SiteService');
        $validator = $service->validateCreateSite($params);
        if ($validator->fails()) {
            return $this->createValidateErrorResponse($validator);
        }
        $id = $service->createSite($params);
        return [
            'result' => true,
            'id' => $id,
        ];
    }

    /**
     * サイト情報更新
     *
     * @param Request $request
     * @param integer $id
     * @return array
     */
    public function update(Request $request, int $id)
    {
        $params = $this->paramsFromRequest($request);
        $params->put('siteId', $id);

        $service = $this->service('SiteService');
        $validator = $service->validateUpdateSite($params);
        if ($validator->fails()) {
            return $this->createValidateErrorResponse($validator);
        }
        $result = $service->updateSite($params);
        return [
            'result' => $result,
        ];

    }

    /**
     * サイト削除
     *
     * @param Request $request
     * @param integer $id
     * @return array
     */
    public function destroy(Request $request, int $id)
    {
        $params = $this->paramsFromRequest($request);
        $params->put('siteId', $id);

        $service = $this->service('SiteService');
        $result = $service->deleteSite($params);
        return [
            'result' => $result,
        ];
    }

}
