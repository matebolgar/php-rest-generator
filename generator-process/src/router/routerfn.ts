import {Entity, OutputFile} from '../template';

export const routerFn = (namespaceRoot, entity: Entity): OutputFile => ({
  filename: `Generated/Route/RouterFn.php`,
  content: `<?php

namespace ${namespaceRoot}\\Generated\\Route;

use ${namespaceRoot}\\Generated\\Request;
use mysqli;

interface RouterFn {
    public function getRoute(Request $request): string;
}

  `
});