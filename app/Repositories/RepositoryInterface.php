<?php

namespace App\Repositories;

use App\Entities\EntityInterface;

interface RepositoryInterface
{
    public function find($id);

    public function regist(EntityInterface $entity);

    public function update(EntityInterface $entity);

    public function destroy(EntityInterface $entity);
    
}