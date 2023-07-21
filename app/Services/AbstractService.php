<?php

namespace App\Services;

use App\Repositories\RepositoryUsable;
use App\Entities\EntityUsable;
use Illuminate\Support\Facades\DB;

class AbstractService implements ServiceInterface
{
    use EntityUsable;
    use RepositoryUsable;

    /**
     * トランザクションbegin
     *
     * @return void
     */
    protected function begin()
    {
        $this->beginTransaction();
    }

    /**
     * トランザクションbegin
     *
     * @return void
     */
    protected function beginTransaction()
    {
        DB::beginTransaction();
    }

    /**
     * トランザクションcommit
     *
     * @return void
     */
    protected function commit()
    {
        DB::commit();
    }

    /**
     * トランザクションrollback
     *
     * @return void
     */
    protected function rollback()
    {
        DB::rollback();
    }
}