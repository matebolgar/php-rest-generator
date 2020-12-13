import {Entity, firstToUpper, OutputFile, sum} from '../template';

export const sqlSaver = (namespaceRoot, entity: Entity): OutputFile => {

  const isNotId = field => field.name !== 'id';

  const types = {
    string: 's',
    int: 'i',
    bool: 'i',
    json: 's',
  };

  return {
    filename: `out/Repository/${firstToUpper(entity.name)}/SqlSaver.php`,
    content: `<?php

namespace ${namespaceRoot}\\Generated\\Repository\\${firstToUpper(entity.name)};

use ${namespaceRoot}\\Generated\\OperationError;
use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Save\\New${firstToUpper(entity.name)};
use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Save\\Saver;
use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\${firstToUpper(entity.name)};
use mysqli;

class SqlSaver implements Saver
{
    private $connection;

    public function __construct(mysqli $connection)
    {
        $this->connection = $connection;
    }

    public function Save(New${firstToUpper(entity.name)} $new): ${firstToUpper(entity.name)}
    {
        try {
            $statement = $this->connection->prepare(
                "INSERT INTO \`${entity.pluralName}\` (
                ${entity.fields.map(field => `\`${field.name}\``).join(', ')}
                ) 
                VALUES (NULL, ${entity.fields.filter(isNotId).map(() => '?')});"
            );
    
            ${entity.fields.filter(isNotId).map(field => `$${field.name} = $new->get${firstToUpper(field.name)}();\n        `).reduce(sum)}
    
            $statement->bind_param(
                "${entity.fields.filter(isNotId).map(field => types[field.type]).reduce(sum)}",
                 ${entity.fields.filter(isNotId).map(field => `$${field.name}`).join(', ')}        
             );
            $statement->execute();
    
            return new ${firstToUpper(entity.name)}((string)$statement->insert_id, ${entity.fields.filter(isNotId).map(field => `$new->get${firstToUpper(field.name)}()`)});
        } catch (\\Error $exception) {
            if ($_SERVER['DEPLOYMENT_ENV'] === 'dev') {
                var_dump($exception);
                exit;
            }
            throw new OperationError("save error");
        } catch (\\Exception $exception) {
            if ($_SERVER['DEPLOYMENT_ENV'] === 'dev') {
                var_dump($exception);
                exit;
            }
            throw new OperationError("save error");
        }
    }
}

`
  };
};