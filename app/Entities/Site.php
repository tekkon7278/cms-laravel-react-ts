<?php

namespace App\Entities;

/**
 * @method string getName()
 * @method string getDomain()
 * @method string getColorTheme()
 * @method float getFontSize()
 * @method string getLogoImage()
 * @method bool getIsPublished()
 * @method Site setName($value)
 * @method Site setDomain($value)
 * @method Site setColorTheme($value)
 * @method Site setFontSize($value)
 * @method Site setLogoImage($value)
 * @method Site setIsPublished($value)
 */
class Site extends AbstractEntity
{
    protected $properties = [
        'name' => [
            'rule' => [
                'required',
                'max:30',
                'unique:sites,site_name,{id},id',
            ]
        ],
        'domain' => [
            'rule' => [
                'required',
                'max:30',
                'regex:/^[a-z][a-z0-9\.\-]+\.[a-z]+$/',
                'unique:sites,domain,{id},id',
            ]
        ],
        'colorTheme' => [
        ],
        'fontSize' => [
            'type' => 'float',
        ],
        'elementSpace' => [            
        ],
        'logoImage' => [
            'rule' => [
                // 'required',
                'max:10485760',
            ]
        ],
        'isPublished' => [
            'type' => 'boolean',
        ],
    ];

}
