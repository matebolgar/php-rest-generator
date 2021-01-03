import {Entity, firstToUpper, OutputFile} from '../template';


export const routePatcher = (namespaceRoot, entity: Entity): OutputFile => ({
  filename: `Generated/Route/${firstToUpper(entity.name)}/${firstToUpper(entity.name)}Patcher.php`,
  content: `<?php

namespace ${namespaceRoot}\\Generated\\Route\\${firstToUpper(entity.name)};

use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Patch\\PatchController;
use ${namespaceRoot}\\Generated\\OperationError;
use ${namespaceRoot}\\Generated\\Repository\\${firstToUpper(entity.name)}\\SqlPatcher;
use ${namespaceRoot}\\Generated\\ValidationError;
use ${namespaceRoot}\\Generated\\Route\\RouterFn;
use ${namespaceRoot}\\Generated\\Repository\\Auth\\JwtTokenVerifier;
use ${namespaceRoot}\\Generated\\Route\\Auth\\AuthHeaderParser;
use ${namespaceRoot}\\Generated\\Request;
use mysqli;

class ${firstToUpper(entity.name)}Patcher implements RouterFn
{
    public function getRoute(Request $request): string
    {
       ${entity.operations.patch.isAuthActive ? `(new JwtTokenVerifier())->verify((new AuthHeaderParser())->getBearerToken() ?? '');` : ''}

        header("Content-Type: application/json");
        return json_encode((new PatchController(
            new SqlPatcher($request->connection),
            new OperationError(),
            new ValidationError()
        ))
            ->patch($request->body ?? [], $request->vars['id']), JSON_UNESCAPED_UNICODE);
    }
}

  `
});