<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * ブラウザからドメインでアクセスした場合のサイト表示コントローラー
 */
class DomainController extends Controller
{
    public function index(Request $request)
    {
        $params = $this->paramsFromRequest();
        $params->put('domain', $request->host());
        $params->put('pathname', (string)Str::of($request->path())->trim('/'));
        
        /** @var $service App\Services\SiteService */
        $service = $this->service('SiteService');
        $page = $service->getPageFromUrl($params);
        if ($page === null || $page->isPublished() === false) {
            $message = ($page === null) ? 'page data not found.' : 'page is not published.';
            logger()->info($message);
            abort(404);
        }

        return view('index', [
            'page' => $page,
        ]);
    }
}
