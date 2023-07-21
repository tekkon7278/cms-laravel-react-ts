<?php

namespace App\Entities;

use Illuminate\Support\Str;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;

abstract class AbstractEntity extends \ArrayObject implements EntityInterface
{
    /**
     * IDを表すプロパティ名
     *
     * @var string
     */
    protected $idName = 'id';

    /**
     * プロパティ定義
     *
     * @var array
     */
    protected $properties = [
        'item1' => [
            'rule' => [                
            ],
        ],
        'item2' => [
            'type' => 'boolean'
        ],
        'item3' => [],
    ];

    /**
     * 継承を想定したプロパティの追加定義
     * プロパティを定義したエンティティを更に継承して追加のプロパティが必要な場合に利用
     *
     * @var array
     */
    protected $propertiesOverride = [];

    /**
     * コンストラクタ
     *
     * @param int|string $id
     */
    public function __construct($id = null)
    {
        $this->properties = array_merge($this->properties, $this->propertiesOverride);
        if ($id !== null) {
            $this->set($this->idName, $id);            
        }
    }

    /**
     * __call
     * 
     * プロパティ名に対して"set"や"get"を接頭するメソッド呼び出しに対して
     * セッター・ゲッターとして機能することを実現
     *
     * @param string $key
     * @param mixed $value
     * @return mixed
     */
    public function __call($key, $value)
    {
        if (Str::length($key) > 3 && substr($key, 0, 3) === 'set') {
            $propertyName = Str::lcfirst(substr($key, 3));
            $this->set($propertyName, array_pop($value));
            return $this;
        } else {
            $propertyName = $key;
            if (Str::length($key) > 3 && substr($key, 0, 3) === 'get') {
                $propertyName = Str::lcfirst(Str::substr($key, 3));
            }
            return $this->get($propertyName);
        }
    }

    /**
     * バリデーションルール配列を取得
     * 
     * $this->properties内に定義されたルールを抽出してValidatorにわたす形式のルール配列を生成する
     *
     * @return array
     */
    public function getValidateRules()
    {
        $rules = [];
        foreach ($this->properties as $propKey => $propSetting) {
            if (!Arr::has($propSetting, 'rule')) {
                continue;
            }

            $propRules = $propSetting['rule'];

            // uniqueルールが存在する場合は自分自身のIDを避ける設定追加
            foreach ($propRules as $index => $propRule) {
                if (Str::startsWith($propRule, 'unique')) {
                    // $replaceId = $this->hasId() ? $this->getId() : '';
                    // $propRules[$index] = Str::replace('{id}', $replaceId, $propRule);

                    $replacedRule = $propRule;
                    if (preg_match_all('/{([^}]+)}/', $propRule, $matches)) {
                        foreach ($matches[1] as $i => $match) {
                            $replace = $this->has($match) ? $this->get($match) : '';
                            $replacedRule = Str::replace('{' . $match . '}', $replace, $replacedRule);
                        }
                    }
                    $propRules[$index] = $replacedRule;
                }
            }

            $rules[$propKey] = $propRules;
        }
        return $rules;
    }

    /**
     * ルールとプロパティをセット済みのValidatorを生成
     *
     * @param boolean $all trueならプロパティの値保持の有無に関わらず全ルール取得。falseなら値保持しているルールのみ取得
     * @return Validator
     */
    public function validate($all = false)
    {
        $values = $this->toArray();
        $allRules = $this->getValidateRules();
        
        $rules = $allRules;
        if (!$all) {
            $rules = Arr::where($allRules, function($rule, $propKey) use ($values) {
                return Arr::has($values, $propKey);
            });
        }

        $validator = Validator::make($values, $rules);
        return $validator;
    }

    /**
     * すべてのルール定義とプロパティをセット済みのValidatorを生成
     * 
     * @return Validator
     */
    public function validateAll()
    {
        return $this->validate(true);
    }

    /**
     * 配列からプロパティ値を一括セット
     *
     * @param array $values
     * @return AbstractEntity
     */
    public function fill($values)
    {
        foreach ($values as $key => $value) {
            $setter = 'set' . Str::lcfirst($key);
            $this->$setter($value);
        }
        return $this;
    }

    /**
     * IDを取得
     *
     * @return int|string
     */
    public function getId()
    {
        return $this->offsetGet($this->idName);
    }

    /**
     * 指定のプロパティの値を取得
     *
     * @param string $key
     * @return mixed
     */
    public function get($key)
    {
        if ($key === $this->idName) {
            return $this->getId();
        }
        if (!$this->isDefined($key) || !$this->has($key)) {
            throw new \Exception('"' . $key . '" is not undefined property');
        }
        return $this->offsetGet($key);
    }

    /**
     * IDを設定
     *
     * @param int|string $value
     * @return AbstractEntity
     */
    public function setId($value)
    {
        $this->offsetSet($this->idName, $value);
        return $this;
    }

    /**
     * 指定のプロパティの値を設定
     *
     * @param string $key
     * @param mixed $value
     * @return AbstractEntity
     */
    public function set($key, $value)
    {
        if ($key === $this->idName) {
            $this->setId($value);
            return $this;
        }
        if (!$this->isDefined($key)) {
            throw new \Exception('"' . $key . '" is not undefined property');
        }
        $this->preSet($key, $value);
        $this->offsetSet($key, $this->cast($key, $value));
        $this->postSet($key, $value);
        return $this;
    }

    /**
     * プロパティの型定義にしたがって型変換
     *
     * @param string $key
     * @param mixed $value
     * @return mixed
     */
    protected function cast($key, $value)
    {
        if (!$this->isDefined($key)
            || !is_array($this->properties[$key])
            || !Arr::has($this->properties[$key], 'type')) {
            return $value;
        }
        
        $type = $this->properties[$key]['type'];
        if ($type === 'boolean' || $type === 'bool') {
            $value = (bool)$value;
        } elseif ($type === 'int' || $type === 'integer') {
            $value = (int)$value;
        } elseif ($type === 'string') {
            $value = (string)$value;
        }

        return $value;
    }

    /**
     * プロパティ値setの直前処理
     *
     * @param string $key
     * @param mixed $value
     * @return void
     */
    public function preSet($key, $value)
    {
    }

    /**
     * プロパティ値setの直後処理
     *
     * @param string $key
     * @param mixed $value
     * @return void
     */
    public function postSet($key, $value)
    {
    }

    /**
     * ID値がセットされているか確認
     *
     * @return boolean
     */
    public function hasId()
    {
        return $this->has('id');
    }
    
    /**
     * 指定のプロパティの値がセットされているか確認
     *
     * @param string $key
     * @return boolean
     */
    public function has($key)
    {
        return $this->offsetExists($key);
    }

    /**
     * 指定のプロパティ名の定義が存在するか確認
     *
     * @param string $key
     * @return boolean
     */
    public function isDefined($key)
    {
        return Arr::has($this->properties, $key);
    }

    /**
     * プロパティ値をすべて配列として取得
     *
     * @return array
     */
    public function toArray()
    {
        return $this->getArrayCopy();
    }
}
