import {Entity, firstToUpper, OutputFile, sum} from '../template';

export const sqlUpdater = (namespaceRoot, entity: Entity): OutputFile => {

  const isNotId = field => field.name !== 'id';

  const types = {
    string: 's',
    json: 's',
    int: 'i',
    bool: 'i'
  };

  return {
    filename: `out/Repository/${firstToUpper(entity.name)}/SqlUpdater.php`,
    content: `<?php

namespace ${namespaceRoot}\\Generated\\Repository\\${firstToUpper(entity.name)};

use ${namespaceRoot}\\Generated\\OperationError;
use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Update\\Updated${firstToUpper(entity.name)};
use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Update\\Updater;
use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\${firstToUpper(entity.name)};
use mysqli;

class SqlUpdater implements Updater
{
    private $connection;

    public function __construct(mysqli $connection)
    {
        $this->connection = $connection;
    }

    public function update(string $id, Updated${firstToUpper(entity.name)} $entity): ${firstToUpper(entity.name)}
    {
        try {
          $byId = (new SqlByIdGetter($this->connection))->byId($id);
          
          $stmt = $this->connection->prepare(
              'UPDATE \`${entity.pluralName}\` SET 
                ${entity.fields
      .filter(isNotId)
      .filter(field => !field.isReadonly)
      .map(field => `\`${field.name}\` = ?`).join(', ')}
                WHERE \`id\` = ?;'
          );
          
          ${entity.fields.filter(isNotId).filter(field => !field.isReadonly).map(field => `$${field.name}= $entity->get${firstToUpper(field.name)}();\n        `).reduce(sum, '')} 
          $stmt->bind_param(
              "${entity.fields.filter(isNotId).filter(field => !field.isReadonly).map(field => types[field.type]).reduce(sum, '')}s",
               ${entity.fields.filter(isNotId).filter(field => !field.isReadonly).map(field => `$${field.name}`).join(', ')}, $id        
          );
          $stmt->execute();
          
          return new ${firstToUpper(entity.name)}($id, ${entity.fields
      .filter(isNotId)
      .map(field => field.isReadonly ? `$byId->get${firstToUpper(field.name)}()` : `$entity->get${firstToUpper(field.name)}()`)});
      
      } catch (\\Error $exception) {
          if ($_SERVER['DEPLOYMENT_ENV'] === 'dev') {
            var_dump($exception);
            exit;
          }
          throw new OperationError("update error");
      } catch (\\Exception $exception) {
          if ($_SERVER['DEPLOYMENT_ENV'] === 'dev') {
            var_dump($exception);
            exit;
          }
          throw new OperationError("update error");
      }
    }
}

`
  };
};