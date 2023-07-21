<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SiteModel extends Model
{
    use HasFactory;

    protected $table = 'sites';

    const THEME_MONO = 0;
    const THEME_BLUE = 1;
    const THEME_RED = 2;
    const THEME_GREEN = 3;
    const THEME_PURPLE = 4;
    const THEME_ORANGE = 5;
    
    const IS_PUBLISHED_TRUE = 1;
    const IS_PUBLISHED_FALSE = 0;

}
