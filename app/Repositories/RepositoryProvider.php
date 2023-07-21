<?php

namespace App\Repositories;

class RepositoryProvider
{
    public static function make($repositoryName)
    {
        $repository = app()->make($repositoryName);
        if (!$repository instanceof RepositoryInterface) {
            throw new \Exception('"' . $repositoryName . '" is invalid repository name.');
        }
        return $repository;
    }
}
