<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContentModel extends Model
{
    use HasFactory;

    protected $table = 'contents';

    const TYPE_TEXT = 1;
    const TYPE_TITLE = 2;
    const TYPE_CODE = 3;
    const TYPE_LIST = 4;
    const TYPE_TABLE = 5;
    const TYPE_IMAGE = 6;
    const TYPE_COLUMNS = 99;
    
    const IS_PUBLISHED_TRUE = 1;
    const IS_PUBLISHED_FALSE = 0;
}
