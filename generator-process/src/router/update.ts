import {Entity, firstToUpper, OutputFile} from '../template';


export const routeUpdater = (namespaceRoot, entity: Entity): OutputFile => ({
  filename: `Generated/Route/${firstToUpper(entity.name)}/${firstToUpper(entity.name)}Updater.php`,
  content: `<?php

namespace ${namespaceRoot}\\Generated\\Route\\${firstToUpper(entity.name)};

use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Update\\UpdateController;
use ${namespaceRoot}\\Generated\\OperationError;
use ${namespaceRoot}\\Generated\\Repository\\${firstToUpper(entity.name)}\\SqlUpdater;
use ${namespaceRoot}\\Generated\\ValidationError;
use ${namespaceRoot}\\Generated\\Route\\RouterFn;
use ${namespaceRoot}\\Generated\\Repository\\Auth\\JwtTokenVerifier;
use ${namespaceRoot}\\Generated\\Route\\Auth\\AuthHeaderParser;
use ${namespaceRoot}\\Generated\\Request;
use mysqli;

class ${firstToUpper(entity.name)}Updater implements RouterFn
{
    public function getRoute(Request $request): string
    {
        ${entity.operations.update.isAuthActive ? `(new JwtTokenVerifier())->verify((new AuthHeaderParser())->getBearerToken() ?? '');` : ''}
    
        header("Content-Type: application/json");
        return json_encode((new UpdateController(
            new SqlUpdater($request->connection),
            new OperationError(),
            new ValidationError()
        ))
            ->update($request->body ?? [], $request->vars['id']), JSON_UNESCAPED_UNICODE);
    }
}

  `
});