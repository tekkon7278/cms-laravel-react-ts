<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

/**
 * CMSでのプレビュー表示コントローラー
 */
class IndexController extends Controller
{
    public function index($siteId, $pageId)
    {
        $params = $this->paramsFromRequest();
        $params->put('siteId', $siteId);
        $params->put('pageId', $pageId);

        $service = $this->service('SiteService');
        $page = $service->getSitePage($params);
        if ($page === null) {
            abort(404);
        }

        return view('index', [
            'page' => $page,
        ]);
    }
}
