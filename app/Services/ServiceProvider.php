<?php

namespace App\Services;

/**
 * Serviceクラスのファクトリ的クラス
 */
class ServiceProvider
{
    /**
     * Serviceクラスのインスタンスを生成
     * 
     * 毎回新たなインスタンスを生成する
     * 引数はProviders\AppServiceProviderで定義した名前
     *
     * @param string $serviceName
     * @return ServiceInterface
     */
    public static function make(string $serviceName)
    {
        $service = app()->make($serviceName);
        if (!$service instanceof ServiceInterface) {
            throw new \Exception('"' . $serviceName . '" is invalid service name.');
        }
        return $service;
    }
}
