import {Entity, Field, firstToUpper, OutputFile} from '../template';
import {typeMap} from './sqlister';

export const sqlById = (namespaceRoot, entity: Entity): OutputFile => {

  return {
    filename: `Generated/Repository/${firstToUpper(entity.name)}/SqlByIdGetter.php`,
    content: `<?php

namespace ${namespaceRoot}\\Generated\\Repository\\${firstToUpper(entity.name)};

use mysqli;
use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\ById\\ById;
use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\${firstToUpper(entity.name)};
use ${namespaceRoot}\\Generated\\OperationError;

class SqlByIdGetter implements ById
{
    private $connection;

    public function __construct(mysqli $connection)
    {
        $this->connection = $connection;
    }

    public function byId(string $id): ${firstToUpper(entity.name)}
    {
        try {
            $stmt = $this->connection->prepare('SELECT * FROM \`${entity.pluralName}\` WHERE id = ?');
            $stmt->bind_param('s', $id);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();
            return new ${firstToUpper(entity.name)}(${entity.fields.map((field: Field) => {

              if(field.isRequired) {
                return `(${typeMap[field.type]})$result['${field.name}']`;
              }
              
              return `$result['${field.name}'] === null ? null : (${typeMap[field.type]})$result['${field.name}']`
            }
            ).join(',\n                        ')});
        
        } catch (\\Error $exception) {
            if ($_SERVER['DEPLOYMENT_ENV'] === 'dev') {
                var_dump($exception);
                exit;
            }
            throw new OperationError("by id error");
        } catch (\\Exception $exception) {
            if ($_SERVER['DEPLOYMENT_ENV'] === 'dev') {
                var_dump($exception);
                exit;
            }
            throw new OperationError("by id error");
        }
    }
}

`
  };
};