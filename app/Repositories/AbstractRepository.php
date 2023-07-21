<?php

namespace App\Repositories;

use Illuminate\Support\Collection;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use App\Entities\EntityUsable;
use App\Entities\EntityInterface;
use App\Entities\AbstractEntity;
use App\Entities\EntityFactoryInterface;

abstract class AbstractRepository implements RepositoryInterface
{
    use EntityUsable;

    /**
     * ModelとEntityの項目名変換マッピング配列（主テーブル）
     *
     * @var array
     */
    protected $keyMap = [];

    /**
     * ModelとEntityの項目名変換マッピング配列（リレーションテーブル）
     *
     * @var array
     */
    protected $foreignMap = [];

    /**
     * ModelとEntityの項目値変換マッピング配列
     *
     * @var array
     */
    protected $valueMap = [];

    /**
     * ModelからEntityへ変換
     *
     * @param string|AbstractEntity $entity
     * @param Model|array $model
     * @return AbstractEntity
     */
    protected function createEntity($entity, $model)
    {
        // 入力データを配列化
        $modeValues = $model;
        if ($model instanceof Model) {
            $modeValues = $model->getAttributes();
        }
        
        // 変換マップに従いEntity用のvalueに変換
        $entityValues = $this->exchangeModelValues($modeValues);

        // Entity生成
        $entityInstance = $entity;
        if (is_string($entity)) {
            $entityInstance = $this->entity($entity);
            if ($entityInstance instanceof EntityFactoryInterface) {
                $entityInstance = $entityInstance->provideFromEntityValues($entityValues);
            }
        }
        if (!$entityInstance instanceof EntityInterface) {
            throw new \Exception('Entity parameter is invalid.');
        }
        
        /** @var AbstractEntity $entityInstance */
        $entityInstance->fill($entityValues);
        return $entityInstance;
    }

    /**
     * ModelのCollectionからEntityのCollectionへ変換
     *
     * @param string|EntityInterface $entity
     * @param Collection $collection
     * @return Collection
     */
    protected function createEntityCollection($entity, Collection $collection)
    {
        $outputCollection = new Collection();
        foreach ($collection as $model) {
            $entityInstance = $this->createEntity($entity, $model);
            $outputCollection->add($entityInstance);
        }    
        return $outputCollection;
    }

    /**
     * 変換マップに従ってEntityからデータベース項目名の配列へ変換
     *
     * @param AbstractEntity $entity
     * @return array
     */
    protected function getModelValuesFromEntity(EntityInterface $entity)
    {
        $entityValues = $entity->toArray();

        // 変換マップに従いModel用のkeyに変換
        $modelValues = $this->exchangeEntityValues($entityValues);

        $modelValues = $this->exchangeEntityValuesPost($entity, $modelValues);

        return $modelValues;
    }

    /**
     * 変換マップに従いデータベース項目名配列からEntity用配列に変換
     *
     * @param array $modelValues
     * @return array
     */
    protected function exchangeModelValues($modelValues)
    {
        $exchenged = [];
        $keyMap = array_merge($this->keyMap, $this->foreignMap);

        foreach ($modelValues as $modelKey => $modelValue) {
            if (!Arr::has($keyMap, $modelKey)) {
                continue;
            }
            $key = $keyMap[$modelKey];

            $value = $modelValue;
            if (Arr::has($this->valueMap, $modelKey)) {
                if (Arr::has($this->valueMap[$modelKey], $modelValue)) {
                    $value = $this->valueMap[$modelKey][$modelValue];
                }
            }

            $exchenged[$key] = $value;
        }
        return $exchenged;
    }

    /**
     * 変換マップに従いEntity用配列からデータベース項目名の配列に変換
     *
     * @param array $entityValues
     * @return array
     */
    protected function exchangeEntityValues($entityValues)
    {
        $exchenged = [];
        $keyMap = array_flip(array_merge($this->keyMap, $this->foreignMap));

        foreach ($entityValues as $entityKey => $entityValue) {

            if (!Arr::has($keyMap, $entityKey)) {
                continue;
            }
            $key = $keyMap[$entityKey];

            $value = $entityValue;
            if (Arr::has($this->valueMap, $key)) {
                $reversedValueMap = array_flip($this->valueMap[$key]);
                if (Arr::has($reversedValueMap, $entityValue)) {
                    $value = $reversedValueMap[$entityValue];
                }
            }

            $exchenged[$key] = $value;
        }
        return $exchenged;
    }

    protected function exchangeEntityValuesPost(EntityInterface $entity, array $exchangedValues)
    {
        return $exchangedValues;
    }

}