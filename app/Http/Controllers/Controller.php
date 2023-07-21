<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Support\Facades\Validator;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use App\Services\ServiceUsable;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
    use ServiceUsable;

    /**
     * returnするエンティティのプロパティとレスポンスするJSONの項目キー変換マップ
     *
     * @var array
     */
    protected $paramKeyMap = [];

    /**
     * RequestからServiceクラスのパラメータへ変換
     * 
     * $this->paramKeyMapでの定義に従って変換する。
     * 定義がない場合はキャメルに変換
     * 
     * @param Request|null $request
     * @return Collection
     */
    protected function paramsFromRequest(Request $request = null)
    {
        $params = new Collection();
        if ($request instanceof Request) {
            foreach ($request->all() as $inputKey => $inputValue) {
                $outputKey = '';
                if (Arr::has($this->paramKeyMap, $inputKey)) {
                    $outputKey = $this->paramKeyMap[$inputKey]; 
                } else {
                    $outputKey = Str::camel($inputKey);
                }
                $value = is_string($inputValue) ? trim($inputValue) : $inputValue;
                $params->put($outputKey, $value);
            }
        } 
        return $params;
    }

    /**
     * Validation結果エラーの場合のレスポンスデータ生成
     *
     * @param Validator $validator
     * @return array
     */
    protected function createValidateErrorResponse($validator)
    {
        return [
            'result' => false,
            'messages' => $validator->errors()->all(),
        ];
    }
}
