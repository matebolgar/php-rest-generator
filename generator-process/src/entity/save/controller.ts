import {typeMap} from '../../repository/sqlister';
import {Entity, Field, firstToUpper, OutputFile, sum} from '../../template';

const nullTypeMap = {
  string: '\'\'',
  json: '\'\'',
  int: 0,
  bool: false
};

const validatorFnMap = {
  string: 'isString',
  json: 'isJson',
  int: 'isInt',
  bool: 'isBool',
};

const transformedValue = (field: Field) => {
  switch (field.valueTransformer) {
    case 'slug':
      return `$entity['${field.name}'] = $this->slugifier->slugify($entity['${field.name}'] ?? '');\n`;
    case 'currentTimestamp':
      return `$entity['${field.name}'] = (new \\DateTime())->getTimestamp();\n`;
  }
};

const toNew = (field: Field) => {
  if (field.isRequired) {
    return `(${typeMap[field.type]})($entity['${field.name}'])`;
  }
  if (field.default) {
    return `($entity['${field.name}'] ?? ${field.default ? (field.type === 'string' || field.type === 'json' ? `"${field.default}"` : field.default) : ''})`;
  }

  return `(${typeMap[field.type]})($entity['${field.name}'] ?? ${nullTypeMap[field.type]})`;
};


export const saveController = (namespaceRoot, entity: Entity): OutputFile => ({
  filename: `out/${firstToUpper(entity.name)}/Save/SaveController.php`,
  content: `<?php

  namespace ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Save;

  use Exception;
  use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Error\\Error;
  use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Error\\OperationError;
  use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Error\\ValidationError;
  use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Listing\\Lister;
  use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\${firstToUpper(entity.name)};
  use ${namespaceRoot}\\Generated\\Listing\\Clause;
  use ${namespaceRoot}\\Generated\\Listing\\Filter;
  use ${namespaceRoot}\\Generated\\Listing\\OrderBy;
  use ${namespaceRoot}\\Generated\\Listing\\Query;

  class SaveController
{
    private $saver;

    private $lister;

    private $validationError;

    private $operationError;

    public function __construct(Saver $saver, Lister $lister, ValidationError $validationError, OperationError $operationError, Slugifier $slugifier)
    {
        $this->saver = $saver;
        $this->validationError = $validationError;
        $this->operationError = $operationError;
        $this->slugifier = $slugifier;
        $this->lister = $lister;
    }

    public function save(array $entity): ${firstToUpper(entity.name)}
    {
        $missing = array_map(function ($fieldName) {
            return Error::getValidationError($fieldName);
        }, array_filter([${entity.fields
    .filter(field => field.isRequired)
    .filter(field => field.name !== 'id')
    .map(field => `'${field.name}'`)
    .join(', ')
    }], function ($fieldName) use ($entity) {
            return empty($entity[$fieldName]);
        }));

        ${entity.fields
    .filter(field => field.valueTransformer)
    .filter(field => field.name !== 'id')
    .map(transformedValue)
    .reduce(sum, '')}

        $notUnique = array_map(function ($fieldName) {
            return Error::getNotUniqueError($fieldName);
        }, array_filter([${entity.fields
    .filter(field => field.isUnique)
    .filter(field => field.name !== 'id')
    .map(field => `'${field.name}'`).join(', ')}], function ($fieldName) use ($entity) {
            return !empty($this->lister
                ->list(new Query(1, 0, new Clause('eq', $fieldName, $entity[$fieldName] ?? ''), new OrderBy('', '')))
                ->getEntities());
        }));

        //  $type = array_map(function ($keyValue) {
        //     return Error::getTypeError($keyValue[0]);
        // }, array_filter($this->toKeyValue($entity), function ($keyValue) {
        //     return !call_user_func($this->getTypeValidatorFn($keyValue[0]), $keyValue[1]);
        // }));

        $errors = array_merge($notUnique, $missing);

        if (count($errors) > 0) {
            $this->validationError->addErrors($errors);
            throw $this->validationError;
        }

        try {
          $toSave = new New${firstToUpper(entity.name)}(${entity.fields
    .filter(field => field.name !== 'id')
    .map(toNew)
    .join(', ')});
              return $this->saver->Save($toSave);
        } catch (Exception $err) {
                $this->operationError->addField(Error::getOperationError());
                throw $this->operationError;
        }
    }

    private function toKeyValue(array $array)
    {
        return array_map(function ($key, $value) {
            return [$key, $value];
        }, array_keys($array), $array);
    }

    private function getTypeValidatorFn($key)
    {
        $validators = [
            ${entity.fields
    .filter(field => field.name !== 'id')
    .map(field => `'${field.name}' => [$this, '${validatorFnMap[field.type]}']`)
    .join(',\n            ')
    }

        ];
        if (!array_key_exists($key, $validators)) {
            return function ($val) {
                return true;
            };
        }
        return $validators[$key];
    }

    private function isString($val): bool
    {
        return is_string($val);
    }

    private function isInt($val): bool
    {
        return is_int($val);
    }

    private function isBool($val): bool
    {
        return is_bool($val);
    }

    private function isJson($val): bool
    {
        json_decode($val);
        return (json_last_error() == JSON_ERROR_NONE);
    }

  }

`
});

export const saver = (namespaceRoot, entity: Entity): OutputFile => ({
  filename: `out/${firstToUpper(entity.name)}/Save/Saver.php`,
  content: `<?php
    namespace ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Save;

    use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\${firstToUpper(entity.name)};

    interface Saver
    {
        function Save(New${firstToUpper(entity.name)} $new): ${firstToUpper(entity.name)};
    }
    `
});

export const slugifier = (namespaceRoot, entity: Entity): OutputFile => ({
  filename: `out/${firstToUpper(entity.name)}/Save/Slugifier.php`,
  content: `<?php
    namespace ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Save;

    interface Slugifier
    {
        public function slugify(string $item): string;
    }
    `
});
