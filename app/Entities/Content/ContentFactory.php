<?php
namespace App\Entities\Content;

use Illuminate\Support\Arr;
use App\Entities\EntityProvider;
use App\Entities\EntityFactoryInterface;

class ContentFactory implements EntityFactoryInterface
{
    /**
     * コンテンツタイプとエンティティの関連付け設定
     *
     * @var array
     */
    protected $contentTypes = [
        Content::TYPE_TEXT => 'TextContent',
        Content::TYPE_TITLE => 'TitleContent',
        Content::TYPE_CODE => 'TextContent',
        Content::TYPE_LIST => 'ListContent',
        Content::TYPE_IMAGE => 'ImageContent',
        Content::TYPE_COLUMNS => 'ColumnsLayout'
    ];

    /**
     * エンティティへ設定予定のプロパティ値からエンティティのクラスを決定してインスタンス取得
     *
     * @param array $values
     * @return Content
     */
    public function provideFromEntityValues($values)
    {
        if (!Arr::has($values, 'type')) {
            throw new \Exception('values mast have "type",but not.');
        }
        return $this->provideFromType($values['type']);
    }

    /**
     * コンテンツタイプからエンティティクラスを決定してインスタンス取得
     *
     * @param string $typeName
     * @return Content
     */
    public function provideFromType(string $typeName)
    {
        $className = $this->contentTypes[$typeName];
        $entity = EntityProvider::make($className);
        $entity->setType($typeName);
        return $entity;
    }

}
