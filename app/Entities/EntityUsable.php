<?php

namespace App\Entities;

trait EntityUsable
{
    protected function entity($entityName)
    {
        return EntityProvider::make($entityName);
    }
}
