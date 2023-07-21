<?php

namespace App\Entities;

interface EntityInterface
{
    public function getId();

    public function setId($value);

    public function hasId();    

    public function get($key);

    public function set($key, $value);

    public function has($key);

    public function isDefined($key);

    public function fill(array $values);
}
