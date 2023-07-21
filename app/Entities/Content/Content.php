<?php

namespace App\Entities\Content;

use App\Entities\AbstractEntity;

/**
 * @method int getBeforeId()
 * @method int getPageId()
 * @method int getSiteId()
 * @method string getType()
 * @method string getTitle()
 * @method mixed getValue()
 * @method bool getIsPublished()
 * @method Content setBeforeId($value)
 * @method Content setPageId($value)
 * @method Content setSiteId($value)
 * @method Content setType($value)
 * @method Content setTitle($value)
 * @method Content setValue($value)
 * @method Content setIsPublished($value)
 */
class Content extends AbstractEntity
{
    const TYPE_TEXT = 'text';
    const TYPE_TITLE = 'title';
    const TYPE_CODE = 'code';
    const TYPE_LIST = 'list';
    const TYPE_IMAGE = 'image';
    const TYPE_COLUMNS = 'columns';

    protected $properties = [
        'beforeId' => [],
        'parentId' => [],
        'pageId' => [],
        'siteId' => [],
        'type' => [],
        'title' => [],
        'value' => [],
        'padding' => [],
        'isPublished' => [
            'type' => 'boolean',
        ],
    ];

}
