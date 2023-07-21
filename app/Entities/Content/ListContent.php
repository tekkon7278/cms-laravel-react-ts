<?php

namespace App\Entities\Content;

use App\Entities\Content\Content;

class ListContent extends Content
{
    protected $propertiesOverride = [
        'value' => [
            'rule' => [
                'array',
                'required',
            ],
        ],
    ];

    public function setValue($input)
    {
        $list = $input;

        // 空の項目は除去
        if (is_array($input)) {
            $list = array_filter($list, function($item) {
                return trim($item) !== '';
            });
        }
        
        parent::setValue($list);
    }

}
