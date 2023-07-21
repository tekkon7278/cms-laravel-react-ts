<?php

namespace App\Repositories;

use Illuminate\Support\Collection;
use App\Models\PageModel;
use App\Models\ContentModel;
use App\Models\ContentItemModel;
use App\Entities\EntityInterface;
use App\Entities\Content\Content;

class ContentRepository extends AbstractRepository
{
    /**
     * Contentのモデルとエンティティの項目名変換マップ
     *
     * @var array
     */
    protected $keyMap = [
        'id' => 'id',
        'page_id' => 'pageId',
        'content_type' => 'type',
        'content_title' => 'title',
        'content' => 'value',
        'padding' => 'padding',
        'is_published' => 'isPublished',
    ];

    /**
     * Contentのモデルレーションテーブルとエンティティの項目名変換マップ
     *
     * @var array
     */
    protected $foreignMap = [
        'site_id' => 'siteId',
    ];

    /**
     * Contentのモデルとエンティティの値変換マップ
     *
     * @var array
     */
    protected $valueMap = [
        'content_type' => [
            ContentModel::TYPE_TEXT => Content::TYPE_TEXT,
            ContentModel::TYPE_TITLE => Content::TYPE_TITLE,
            ContentModel::TYPE_CODE => Content::TYPE_CODE,
            ContentModel::TYPE_LIST => Content::TYPE_LIST,
            ContentModel::TYPE_IMAGE => Content::TYPE_IMAGE,
            ContentModel::TYPE_COLUMNS => Content::TYPE_COLUMNS,
        ],
    ];

    /**
     * ColumnsLayoutのContentのvalueに保持されている子ContentのリストをModel用の配列に変換
     *
     * @param Content $entity
     * @param array $exchangedValues
     * @return array
     */
    protected function exchangeEntityValuesPost(EntityInterface $entity, array $exchangedValues)
    {
        $ret = $exchangedValues;
        if ($entity->getType() == Content::TYPE_COLUMNS) {
            $modelTypes = [];
            if (is_array($entity->getValue())) {
                foreach ($entity->getValue() as $childContent) {
                    $childValues = $this->exchangeEntityValues($childContent);
                    $modelTypes[] = $childValues['content_type'];
                }
            }
            $ret['content'] = $modelTypes;
        }
        return $ret;
    }

    /**
     * コンテンツID指定でコンテンツ情報取得
     *
     * @param int $contentId
     * @return Content
     */
    public function find($contentId)
    {
        $contentModel = new ContentModel();
        $row = $this->buildModelForFindWithPage()
            ->where('C.id', $contentId)
            ->first();
        if ($row === null) {
            return null;
        }
        $content = $this->createEntity('ContentFactory', $row);
        if ($content->getType() == Content::TYPE_LIST) {
            $items = $this->findItemsById($content->getId());
            $content->setValue($items->pluck('item_value'));
        }
        return $content;
    }

    /**
     * ページID指定でコンテンツリスト取得
     *
     * @param int $pageId
     * @return Collection
     */
    public function findByPageId($pageId)
    {
        $rows = $this->buildModelForFindWithPage($pageId)
            ->where('C.page_id', $pageId)
            ->whereNull('C.parent_id')
            ->get();
        $entities = $this->createEntityCollection('ContentFactory', $rows);

        foreach ($entities as $entity) {
            if ($entity->getType() == Content::TYPE_LIST) {
                $items = $this->findItemsById($entity->getId());
                $entity->setValue($items->pluck('item_value'));
            }
            if ($entity->getType() == Content::TYPE_COLUMNS) {
                $childEntities  = $this->findChildrenById($entity->getId());
                $entity->setValue($childEntities);
            }
        }

        return $entities;
    }

    /**
     * コンテンツID指定でコンテンツのリスト項目の取得
     *
     * @param int $contentId
     * @return Collection
     */
    protected function findItemsById($contentId)
    {
        $contentItemModel = new ContentItemModel();
        $rows = $contentItemModel
            ->where('content_id', $contentId)
            ->orderBy('sort')
            ->get('item_value');
        return $rows;
    }

    /**
     * コンテンツID指定で子コンテンツのリスト取得
     *
     * @param int $contentId
     * @return Collection
     */
    protected function findChildrenById($contentId)
    {
        $rows = $this->buildModelForFindWithPage()
            ->where('C.parent_id', $contentId)
            ->get();
        $childEntities = $this->createEntityCollection('ContentFactory', $rows);
        return $childEntities;
    }

    /**
     * コンテンツ情報取得用の定型モデル生成
     *
     * @return ContentModel
     */
    protected function buildModelForFindWithPage()
    {
        $contentModel = new ContentModel();
        $pageModel = new PageModel();

        return $contentModel
            ->select('C.*')
            ->addSelect('P.site_id')
            ->selectRaw('CASE WHEN binary_content IS NULL THEN content ELSE binary_content END AS content')
            ->from($contentModel->getTable() . ' AS C')
            ->join($pageModel->getTable(). ' AS P', "P.id", "=", "C.page_id")
            ->orderBy('C.sort');
    }

    /**
     * コンテンツ登録
     *
     * @param Content $content
     * @return int
     */
    public  function regist(EntityInterface $content)
    {
        // 並び順sort番号決定
        $contentModel = new ContentModel();
        $sortNo = 1;
        if ($content->has('beforeId') > 0) {
            $beforeSortNo = $contentModel
                ->where('id', $content->getBeforeId())
                ->value('sort');
            if ($beforeSortNo !== null) {
                $sortNo = ++$beforeSortNo;
            }
        }

        // 並び順差込位置以降のレコードのsort番号を一つずらす
        $contentModel = new ContentModel();
        $contentModel
            ->where('page_id', $content->getPageId())
            ->where('sort', '>=', $sortNo)
            ->increment('sort');

        // 登録
        $contentModel = new ContentModel();
        $values = $this->getModelValuesFromEntity($content);
        $insertValues = [
            'page_id' => $content->getPageId(),
            'content_type' => $values['content_type'],
            'sort' => $sortNo,
        ];
        if ($content->has('parentId')) {
            $insertValues['parent_id'] = $content->getParentId();
        }
        $type = $content->getType();
        if ($type !== Content::TYPE_LIST && $type !== Content::TYPE_COLUMNS) {
            $valueColumn = ($type == Content::TYPE_IMAGE) ? 'binary_content' : 'content';
            $insertValues[$valueColumn] = $values['content'];
        }
        $id = $contentModel->insertGetId($insertValues);
        $content->setId($id);
        
        if ($content->getType() == Content::TYPE_LIST) {
            $this->updateItems($content);
        }
        if ($content->getType() == Content::TYPE_COLUMNS) {
            $contentModel = new ContentModel();
            $insertValues = [
                'page_id' => $content->getPageId(),
                'parent_id' => $id,
            ];
            foreach ($values['content'] as $contentType) {
                $insertValues['content_type'] = $contentType;
                $insertValues['sort'] = ++$sortNo;
                $contentModel->insert($insertValues);
            }
        }

        return $id;
    }

    /**
     * コンテンツ情報更新
     *
     * @param Content $content
     * @return bool
     */
    public  function update(EntityInterface $content)
    {
        $contentModel = new ContentModel();        
        $values = $this->getModelValuesFromEntity($content);

        $updateValues = [
            'padding' => $values['padding'],
        ];
        
        if ($content->getType() == Content::TYPE_LIST) {
            $this->updateItems($content);
        } else {
            $valueColumn = ($content->getType() == Content::TYPE_IMAGE) ? 'binary_content' : 'content';
            $updateValues[$valueColumn] = $values['content'];
        }

        $contentModel
            ->where('id', $content->getId())
            ->update($updateValues);

        return true;
    }

    /**
     * リストコンテンツの項目更新
     *
     * @param Content $content
     * @return void
     */
    public function updateItems(Content $content)
    {
        $contentItemModel = new ContentItemModel();
        $contentItemModel
            ->where('content_id', $content->getId())
            ->delete();
        
        $valueRecordes = [];
        $sort = 0;
        foreach ($content->getValue() as $value) {
            $valueRecordes[] = [
                'content_id' => $content->getId(),
                'item_value' => $value,
                'sort' => ++$sort,                    
            ];
        }
        $contentItemModel->insert($valueRecordes);
    }

    /**
     * コンテンツ削除
     *
     * @param Content $content
     * @return int
     */
    public  function destroy(EntityInterface $content)
    {
        $contentModel = new ContentModel();
        $result = $contentModel
            ->where('id', $content->getId())
            ->delete();
        return $result;
    }
}