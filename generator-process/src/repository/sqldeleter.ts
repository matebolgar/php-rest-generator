import {Entity, firstToUpper, OutputFile} from '../template';

export const sqlDeleter = (namespaceRoot, entity: Entity): OutputFile => {

  return {
    filename: `out/Repository/${firstToUpper(entity.name)}/SqlDeleter.php`,
    content: `<?php

namespace ${namespaceRoot}\\Generated\\Repository\\${firstToUpper(entity.name)};

use ${namespaceRoot}\\Generated\\OperationError;
use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Delete\\Deleter;
use mysqli;
use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\${firstToUpper(entity.name)};

class SqlDeleter implements Deleter
{
    private $connection;

    public function __construct(mysqli $connection)
    {
        $this->connection = $connection;
    }

    public function delete(string $id): string
    {
        try { 
          $statement = $this->connection->prepare('DELETE FROM \`${entity.pluralName}\` WHERE \`id\` = ?');
          $statement->bind_param('s', $id);
          $statement->execute();
  
          return $id;   
        } catch (\\Error $exception) {
            throw new OperationError("delete error");
        } catch (\\Exception $exception) {
            throw new OperationError("delete error");
        }
    }
}
`
  };
};