import {Entity, firstToUpper, OutputFile} from '../template';

export const routeLister = (namespaceRoot, entity: Entity): OutputFile => ({
  filename: `out/Route/${firstToUpper(entity.name)}/${firstToUpper(entity.name)}Lister.php`,
  content: `<?php

namespace ${namespaceRoot}\\Generated\\Route\\${firstToUpper(entity.name)};

use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Listing\\ListController;
use ${namespaceRoot}\\Generated\\OperationError;
use ${namespaceRoot}\\Generated\\Paging\\Pager;
use ${namespaceRoot}\\Generated\\Repository\\${firstToUpper(entity.name)}\\SqlLister;
use ${namespaceRoot}\\Generated\\Route\\Error;
use ${namespaceRoot}\\Generated\\Route\\RouterFn;
use ${namespaceRoot}\\Generated\\Repository\\Auth\\JwtTokenVerifier;
use ${namespaceRoot}\\Generated\\Route\\Auth\\AuthHeaderParser;
use ${namespaceRoot}\\Generated\\Request;
use mysqli;

class ${firstToUpper(entity.name)}Lister implements RouterFn
{
    public function getRoute(Request $request): string
    {
        ${entity.operations.list.isAuthActive ? `(new JwtTokenVerifier())->verify((new AuthHeaderParser())->getBearerToken() ?? '');` : ''}

        $query = $request->query;
        Error::validateQueryParams($query, ['from', 'limit']);

        if (isset($query['filters'])) {
            $query['filters'] = (array)json_decode(($query['filters'] ?? ''), true);
        }

        if (isset($query['filters'])) {
            $query['orderBy'] = (array)json_decode(($query['orderBy'] ?? ''), true);
        }

        return json_encode((new ListController(
            new OperationError(),
            new SqlLister($request->connection),
            new Pager())
        )->list($query), JSON_UNESCAPED_UNICODE);
    }
}
  `
});
