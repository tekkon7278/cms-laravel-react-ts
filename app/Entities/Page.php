<?php

namespace App\Entities;

use Illuminate\Support\Collection;

/**
 * @method int getBeforeId()
 * @method int getSiteId()
 * @method string getTitle()
 * @method string getPathname()
 * @method bool getIsIndex()
 * @method int getSort()
 * @method Collection getContents()
 * @method bool getIsPublished()
 * @method Page setBeforeId($value)
 * @method Page setSiteId($value)
 * @method Page setTitle($value)
 * @method Page setPathname($value)
 * @method Page setIsIndex($value)
 * @method Page setSort($value)
 * @method Page setContents($value)
 * @method Page setIsPublished($value)
 */
class Page extends AbstractEntity
{
    protected $properties =[
        'parentId' => [],
        'beforeId' => [],
        'siteId' => [],
        'isShowTitle' => [
            'type' => 'boolean',
        ],
        'title' => [
            'rule' => [
                'required',
                'max:30',
            ],
        ],
        'pathname' => [
            'rule' => [
                'required',
                'max:30',
                'regex:/^[a-z\-]+$/',
                'not_in:api',
                'unique:pages,pathname,{id},id,site_id,{siteId},parent_id,{parentId}',
            ],
        ],
        'isIndex' => [
            'type' => 'boolean',
        ],
        'sort' => [],
        'contents' => [],
        'isPublished' => [
            'type' => 'boolean',
        ],
    ];


}
