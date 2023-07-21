<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PageModel extends Model
{
    use HasFactory;

    protected $table = 'pages';

    const IS_INDEX_TRUE = 1;
    const IS_INDEX_FALSE = 0;

    const IS_PUBLISHED_TRUE = 1;
    const IS_PUBLISHED_FALSE = 0;
}
