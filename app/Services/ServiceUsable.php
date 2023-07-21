<?php

namespace App\Services;

/**
 * Serviceクラスを利用するクラスでuseする
 * Serviceを直接利用してもよいことを表すとともに
 * serviceメソッドでServiceのインスタンスを得ることができる。
 */
trait ServiceUsable
{
    /**
     * Serviceクラスのインスタンスを生成
     *
     * @param string $serviceName Providers\AppServiceProviderで定義した名前
     * @return ServiceInterface
     */
    protected function service(string $serviceName)
    {
        return ServiceProvider::make($serviceName);
    }
}
