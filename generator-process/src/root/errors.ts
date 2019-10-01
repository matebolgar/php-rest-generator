import {firstToUpper, OutputFile, Schema} from '../template';

export const rootOperationError = (schema: Schema): OutputFile => ({
  filename: 'out/OperationError.php',
  content: `<?php

namespace ${schema.namespaceRoot}\\Generated;

use Exception;
use JsonSerializable;
use Throwable;

class OperationError extends Exception implements JsonSerializable, 
${schema.entities
    .map(entity => `\\${schema.namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Error\\OperationError`)
    .join(', ')
    }
{
    private $fields = [];

    public function __construct($message = "", $code = 0, Throwable $previous = null)
    {
        parent::__construct();
        $this->message = [];
    }

    public function addField(array $field)
    {
        $this->fields[] = $field;
    }

    public function getFields()
    {
        return $this->fields;
    }

    public function jsonSerialize()
    {
        return [
            "error" => [
                'errors' => $this->fields,
                'code' => 400,
                'message' => "Operation error",
            ],
        ];
    }
}
`
});

export const rootRequiredError = (schema: Schema): OutputFile => ({
  filename: 'out/ValidationError.php',
  content: `<?php

namespace ${schema.namespaceRoot}\\Generated;

use Exception;
use JsonSerializable;
use Throwable;

class ValidationError extends Exception implements JsonSerializable, 
${schema.entities
    .map(entity => `\\${schema.namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Error\\ValidationError`)
    .join(', ')
    }
{
    private $fields = [];

    public function __construct($message = "", $code = 0, Throwable $previous = null)
    {
        parent::__construct();
        $this->message = [];
    }

    public function addErrors(array $fields)
    {
        $this->fields = $fields;
    }

    public function getFields()
    {
        return $this->fields;
    }

    public function jsonSerialize()
    {
        return [
            "error" => [
                'errors' => $this->fields,
                'code' => 400,
                'message' => "Validation error",
            ],
        ];
    }
}
`
});

export const routeError = (schema: Schema): OutputFile => ({
  filename: 'out/Route/Error.php',
  content: `<?php

namespace ${schema.namespaceRoot}\\Generated\\Route;

use ${schema.namespaceRoot}\\Generated\\ValidationError;

class Error
{
    public static function validateQueryParams(array $query, array $fields)
    {
        $errors = array_filter($fields, function ($fieldName) use ($query) {
            return !isset($query[$fieldName]) || !is_numeric($query[$fieldName]);
        });

        if (count($errors) === 0) {
            return;
        }

        $err = new ValidationError();
        $fields= array_values(array_map(function ($fieldName) {
            return [
                "reason" => "$fieldName is required",
                "message" => "Required",
                "locationType" => "query",
                "location" => "global",
            ];
        }, $errors));

        $err->addErrors($fields);

        throw $err;
    }
}

`
});

