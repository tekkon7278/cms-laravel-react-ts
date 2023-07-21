<?php

namespace App\Entities\Content;

use App\Entities\Content\Content;

class ImageContent extends Content
{
    protected $propertiesOverride = [
        'value' => [
            'rule' => [
                'required',
                'max:10485760',
            ],
        ]
    ];
    
}
