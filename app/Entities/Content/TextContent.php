<?php

namespace App\Entities\Content;

use App\Entities\Content\Content;

class TextContent extends Content
{
    protected $propertiesOverride = [
        'value' => [
            'rule' => [
                'required',
            ],
        ]
    ];

}
