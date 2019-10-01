import {Entity, firstToUpper, OutputFile} from '../template';

export const routeSaver = (namespaceRoot, entity: Entity): OutputFile => ({
  filename: `out/Route/${firstToUpper(entity.name)}/${firstToUpper(entity.name)}Saver.php`,
  content: `<?php

namespace ${namespaceRoot}\\Generated\\Route\\${firstToUpper(entity.name)};

use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Save\\SaveController;
use ${namespaceRoot}\\Generated\\OperationError;
use ${namespaceRoot}\\Generated\\Repository\\${firstToUpper(entity.name)}\\SqlLister;
use ${namespaceRoot}\\Generated\\Repository\\${firstToUpper(entity.name)}\\SqlSaver;
use ${namespaceRoot}\\Generated\\Route\\RouterFn;
use ${namespaceRoot}\\Generated\\Slugifier\\Slugifier;
use ${namespaceRoot}\\Generated\\ValidationError;
use ${namespaceRoot}\\Generated\\Repository\\Auth\\JwtTokenVerifier;
use ${namespaceRoot}\\Generated\\Route\\Auth\\AuthHeaderParser;
use ${namespaceRoot}\\Generated\\Request;
use mysqli;

class ${firstToUpper(entity.name)}Saver implements RouterFn
{
    public function getRoute(Request $request): string
    {
       ${entity.operations.create.isAuthActive ? `(new JwtTokenVerifier())->verify((new AuthHeaderParser())->getBearerToken() ?? '');` : ''}

        return json_encode((new SaveController(
            new SqlSaver($request->connection),
            new SqlLister($request->connection),
            new ValidationError(),
            new OperationError(),
            new Slugifier())
        )
            ->save($request->body ?? []), JSON_UNESCAPED_UNICODE);
    }
}
  `
});


