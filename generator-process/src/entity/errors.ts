import {Entity, firstToUpper, OutputFile} from '../template';

export const error = (namespaceRoot, entity: Entity): OutputFile => ({
  filename: `out/${firstToUpper(entity.name)}/Error/Error.php`,
  content: `<?php

namespace ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Error;

use JsonSerializable;

class Error
{
    public static function getOperationError(): array
    {
        return [
            "reason" => "${entity.name} operation failed",
            "message" => "Operation failed",
            "locationType" => "resource",
            "location" => "${entity.name}",
        ];
    }

    public static function getValidationError(string $fieldName): array
    {
        return [
            "reason" => "$fieldName is required",
            "message" => "required",
            "locationType" => $fieldName,
            "location" => "${entity.name}",
        ];
    }

    public static function getNotUniqueError(string $fieldName): array
    {
        return [
            "reason" => "$fieldName must be unique",
            "message" => "unique",
            "locationType" => $fieldName,
            "location" => "${entity.name}",
        ];
    }

    public static function getTypeError(string $fieldName): array
    {
        return [
            "reason" => "$fieldName type mismatch",
            "message" => "type",
            "locationType" => $fieldName,
            "location" => "${entity.name}",
        ];
    }

}


  `
});


export const operationError = (namespaceRoot, entity: Entity): OutputFile => ({
  filename: `out/${firstToUpper(entity.name)}/Error/OperationError.php`,
  content: `<?php

namespace ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Error;

use Throwable;

interface OperationError extends Throwable
{
    public function addField(array $field);
}
  `
});

export const validationError = (namespaceRoot, entity: Entity): OutputFile => ({
  filename: `out/${entity.name}/Error/ValidationError.php`,
  content: `<?php

namespace ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Error;

use Throwable;

interface ValidationError extends Throwable
{
    public function addErrors(array $fields);
}
  `
});
