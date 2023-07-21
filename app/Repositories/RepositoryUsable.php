<?php

namespace App\Repositories;

trait RepositoryUsable
{
    protected function repository($repositoryName)
    {
        return RepositoryProvider::make($repositoryName);
    }
}
