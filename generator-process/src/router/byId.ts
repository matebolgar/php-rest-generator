import {Entity, firstToUpper, OutputFile} from '../template';

export const routeById = (namespaceRoot, entity: Entity): OutputFile => ({
  filename: `Generated/Route/${firstToUpper(entity.name)}/${firstToUpper(entity.name)}ById.php`,
  content: `<?php

namespace ${namespaceRoot}\\Generated\\Route\\${firstToUpper(entity.name)};

use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\ById\\ByIdController;
use ${namespaceRoot}\\Generated\\OperationError;
use ${namespaceRoot}\\Generated\\Repository\\${firstToUpper(entity.name)}\\SqlByIdGetter;
use ${namespaceRoot}\\Generated\\Route\\RouterFn;
use ${namespaceRoot}\\Generated\\Repository\\Auth\\JwtTokenVerifier;
use ${namespaceRoot}\\Generated\\Route\\Auth\\AuthHeaderParser;
use ${namespaceRoot}\\Generated\\Request;
use mysqli;

class ${firstToUpper(entity.name)}ById implements RouterFn
{
    public function getRoute(Request $request): string
    {
        ${entity.operations.byId.isAuthActive ? `(new JwtTokenVerifier())->verify((new AuthHeaderParser())->getBearerToken() ?? '');` : ''}

        header("Content-Type: application/json");
        return json_encode((new ByIdController(
            new SqlByIdGetter($request->connection),
            new OperationError())
        )
            ->byId($request->vars['id']), JSON_UNESCAPED_UNICODE);
    }
}

  `
});
