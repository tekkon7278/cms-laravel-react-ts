<?php

namespace App\Entities\Content;

use App\Entities\Content\Content;
use Illuminate\Support\Collection;

class ColumnsLayout extends Content
{
    public function setValue($value)
    {
        if ($value instanceof Collection || $value === null) {
            return parent::setValue($value);
        }

        if (!is_array($value)) {
            throw new \Exception('ColumnsLayout::setValue needs argument as array, but not.');
        }

        $factory = new ContentFactory();

        $columnContents = new Collection();
        foreach ($value as $type) {
            $columnContents->push($factory->provideFromType($type));
        }
        parent::setValue($columnContents);
    }

}
