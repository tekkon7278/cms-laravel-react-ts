<?php

namespace App\Entities;

class EntityProvider
{
    public static function make($entityName, $id = null)
    {
        /** @var AbstractEntity $entity */
        $entity = app()->make($entityName);
        if (!$entity instanceof EntityInterface && !$entity instanceof EntityFactoryInterface) {
            throw new \Exception('"' . $entityName . '" is invalid entity name.');
        }
        if ($id !== null) {
            $entity->setId($id);
        }
        return $entity;
    }
}
