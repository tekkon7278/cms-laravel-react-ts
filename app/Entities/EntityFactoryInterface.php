<?php

namespace App\Entities;

interface EntityFactoryInterface
{
    public function provideFromEntityValues($values);
}