import {Entity, firstToUpper, OutputFile} from '../template';

export const routeDeleter = (namespaceRoot, entity: Entity): OutputFile => ({
  filename: `Generated/Route/${firstToUpper(entity.name)}/${firstToUpper(entity.name)}Deleter.php`,
  content: `<?php

namespace ${namespaceRoot}\\Generated\\Route\\${firstToUpper(entity.name)};

use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Delete\\DeleteController;
use ${namespaceRoot}\\Generated\\OperationError;
use ${namespaceRoot}\\Generated\\Repository\\${firstToUpper(entity.name)}\\SqlDeleter;
use ${namespaceRoot}\\Generated\\Route\\RouterFn;
use ${namespaceRoot}\\Generated\\Repository\\Auth\\JwtTokenVerifier;
use ${namespaceRoot}\\Generated\\Route\\Auth\\AuthHeaderParser;
use ${namespaceRoot}\\Generated\\Request;
use mysqli;

class ${firstToUpper(entity.name)}Deleter implements RouterFn
{
    public function getRoute(Request $request): string
    {
         ${entity.operations.delete.isAuthActive ?
        ` (new JwtTokenVerifier())->verify((new AuthHeaderParser())->getBearerToken() ?? '');` : 
          ''}

        header("Content-Type: application/json");
        return json_encode(['id' => (new DeleteController(
            new OperationError(),
            new SqlDeleter($request->connection))
        )
            ->delete($request->vars['id'])], JSON_UNESCAPED_UNICODE);
    }
}
  `
});

