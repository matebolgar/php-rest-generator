import {Entity, firstToUpper, OutputFile, sum} from '../template';

export const sqlPatcher = (namespaceRoot, entity: Entity): OutputFile => {

  const isNotId = field => field.name !== 'id';

  const types = {
    string: 's',
    json: 's',
    int: 'i',
    bool: 'i'
  };

  return {
    filename: `out/Repository/${firstToUpper(entity.name)}/SqlPatcher.php`,
    content: `<?php

namespace ${namespaceRoot}\\Generated\\Repository\\${firstToUpper(entity.name)};

use ${namespaceRoot}\\Generated\\OperationError;
use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Patch\\Patched${firstToUpper(entity.name)};
use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Patch\\Patcher;
use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\${firstToUpper(entity.name)};
use mysqli;

class SqlPatcher implements Patcher
{
    private $connection;

    public function __construct(mysqli $connection)
    {
        $this->connection = $connection;
    }

    public function patch(string $id, Patched${firstToUpper(entity.name)} $entity): ${firstToUpper(entity.name)}
    {
        try {
          $byId = (new SqlByIdGetter($this->connection))->byId($id);
          $merged = $this->merge($byId, $entity);
          
          $stmt = $this->connection->prepare(
              'UPDATE \`${entity.pluralName}\` SET 
                ${entity.fields
      .filter(isNotId)
      .filter(field => !field.isReadonly)
      .map(field => `\`${field.name}\` = ?`).join(', ')}
                WHERE \`id\` = ?;'
          );
          
          call_user_func(function (...$params) use ($stmt) {
                $stmt->bind_param(
                    "${entity.fields.filter(isNotId).filter(field => !field.isReadonly)
      .map(field => types[field.type])
      .reduce(sum, '')}s",
                    ...$params
                );
            },
                ${entity.fields
      .filter(isNotId)
      .filter(field => !field.isReadonly)
      .map(field => `$merged->get${firstToUpper(field.name)}()`)
      .join(',\n        ')}, $id);
          
          
          $stmt->execute();
          
          if ($stmt->error) {
              throw new OperationError($stmt->error);
          }
          
          return new ${firstToUpper(entity.name)}($id, ${entity.fields
      .filter(isNotId)
      .map(field => field.isReadonly ? `$byId->get${firstToUpper(field.name)}()` : `$merged->get${firstToUpper(field.name)}()`)});
      
      } catch (\\Error $exception) {
          throw new OperationError("patch error");
      } catch (\\Exception $exception) {
          throw new OperationError("patch error");
      }
    }

    private function merge(${firstToUpper(entity.name)} $prev, Patched${firstToUpper(entity.name)} $patched): Patched${firstToUpper(entity.name)}
    {
        return new Patched${firstToUpper(entity.name)}(
            ${entity.fields
      .filter(isNotId)
      .filter(field => !field.isReadonly)
      .map(field => `$patched->get${firstToUpper(field.name)}() !== null ? $patched->get${firstToUpper(field.name)}() : $prev->get${firstToUpper(field.name)}()`)
      .join(', ')
      }
        );
    }
}

`
  };
};