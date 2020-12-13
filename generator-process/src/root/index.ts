import {Entity, firstToUpper, OutputFile, Schema, sum} from '../template';


const routerMap = {
  create: (root, isGenerated, entity: Entity) => `
      $r->post('/api/${entity.pluralName}', [
          new \\${root}\\${isGenerated ? 'Generated' : 'Custom'}\\Route\\${firstToUpper(entity.name)}\\${firstToUpper(entity.name)}Saver,
          'getRoute'
      ]);
  `,
  list: (root, isGenerated, entity: Entity) => `
      $r->get('/api/${entity.pluralName}', [
          new \\${root}\\${isGenerated ? 'Generated' : 'Custom'}\\Route\\${firstToUpper(entity.name)}\\${firstToUpper(entity.name)}Lister,
          'getRoute'
      ]);
  `,

  delete: (root, isGenerated, entity: Entity) => `
      $r->delete('/api/${entity.pluralName}/{id}', [
          new \\${root}\\${isGenerated ? 'Generated' : 'Custom'}\\Route\\${firstToUpper(entity.name)}\\${firstToUpper(entity.name)}Deleter,
          'getRoute'
      ]);
  `,
  update: (root, isGenerated, entity: Entity) => `
      $r->put('/api/${entity.pluralName}/{id}', [
          new \\${root}\\${isGenerated ? 'Generated' : 'Custom'}\\Route\\${firstToUpper(entity.name)}\\${firstToUpper(entity.name)}Updater,
          'getRoute'
      ]);
  `,
  patch: (root, isGenerated, entity: Entity) => `
      $r->patch('/api/${entity.pluralName}/{id}', [
          new \\${root}\\${isGenerated ? 'Generated' : 'Custom'}\\Route\\${firstToUpper(entity.name)}\\${firstToUpper(entity.name)}Patcher,
          'getRoute'
      ]);
  `,
  byId: (root, isGenerated, entity: Entity) => `
      $r->get('/api/${entity.pluralName}/{id}', [
          new \\${root}\\${isGenerated ? 'Generated' : 'Custom'}\\Route\\${firstToUpper(entity.name)}\\${firstToUpper(entity.name)}ById,
          'getRoute'
      ]);
  `,
};

export const request = (schema: Schema): OutputFile => ({
  filename: 'out/Request.php',
  content: `<?php

namespace ${schema.namespaceRoot}\\Generated;

class Request
{
    public $vars;
    public $query;
    public $body;
    public $files;
    public $connection;
    public $path;
    public $params;
}`
});

export const rootIndex = (schema: Schema): OutputFile => ({
  filename: 'out/index.php',
  content: `<?php

require '../../vendor/autoload.php';

${schema.entities.map(entity => `use ${schema.namespaceRoot}\\Generated\\Route\\${firstToUpper(entity.name)};\n`).reduce(sum, '')}
use ${schema.namespaceRoot}\\Generated\\ValidationError;
use ${schema.namespaceRoot}\\Generated\\OperationError;
use ${schema.namespaceRoot}\\Generated\\Auth\\AuthException;
use ${schema.namespaceRoot}\\Generated\\Auth\\ExpiredException;
use ${schema.namespaceRoot}\\Generated\\Request;
use FastRoute\\Dispatcher;
use FastRoute\\RouteCollector;

if ($_SERVER['DEPLOYMENT_ENV'] === 'dev') {
    error_reporting(E_ALL);
    ini_set("display_errors", 1);
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
}

if ($_SERVER['REQUEST_METHOD'] === "OPTIONS") {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
    header('Access-Control-Allow-Headers: Origin, Pragma, Cache-control, X-Requested-With, Content-Type, Accept, Authorization');
    exit;
}

$conn = new mysqli(
    $_SERVER['MYSQL_SERVER'],
    $_SERVER['MYSQL_USERNAME'],
    $_SERVER['MYSQL_PASSWORD'],
    $_SERVER['MYSQL_DATABASENAME'],
    $_SERVER['MYSQL_SERVER_PORT']
);

$dispatcher = FastRoute\\simpleDispatcher(function (RouteCollector $r) use ($conn) {

    try {
    
      if (class_exists('\\${schema.namespaceRoot}\\Router')) {
          (new \\${schema.namespaceRoot}\\Router())->registerRoutes($r, $conn);
      }

      ${schema.entities.map(entity => Object
    .values(entity.operations)
    .filter(operation => operation.isActive)
    .map(operation =>
      routerMap[operation.name](schema.namespaceRoot, operation.isGenerated, entity)
    ).reduce(sum, ''))
    .reduce(sum, '')}

     \\${schema.namespaceRoot}\\Generated\\Route\\Auth\\Auth::getRoutes($r, $conn);

    } catch (Error $e) {
        var_dump($e->getMessage());
        http_response_code(500);
        header("Content-Type: application/json");
        echo '{"error": "server error"}';
        exit;
    }
});

switchRoute($dispatcher->dispatch($_SERVER['REQUEST_METHOD'], parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH)), $conn);

function switchRoute(array $routeInfo, mysqli $conn)
{
    header("Content-Type: application/json");
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT,DELETE");
    switch ($routeInfo[0]) {
        case Dispatcher::NOT_FOUND:
            echo json_encode(["error" => "not found"]);
            break;
        case Dispatcher::METHOD_NOT_ALLOWED:
            echo json_encode(["error" => "method not allowed. allowed methods: " . implode(", ", $routeInfo[1])]);
            break;
        case Dispatcher::FOUND:
            parse_str($_SERVER['QUERY_STRING'], $query);
            $data = json_decode(file_get_contents('php://input'), true);
            try {
                $path = parse_url($_SERVER['REQUEST_URI'])['path'];
                $req = (new Request());
                $req->query = $query;
                $req->vars = $routeInfo[2];
                $req->body = $data ?? $_POST;
                $req->files = $_FILES;
                $req->connection = $conn;
                $req->path = $path;
                echo call_user_func($routeInfo[1], $req);
            } catch (ValidationError $err) {
                http_response_code(400);
                echo json_encode($err);
            } catch (OperationError $err) {
                http_response_code(400);
                echo json_encode($err);
            } catch (AuthException $err) {
                http_response_code(401);
                echo json_encode($err);
                exit;
            } catch (ExpiredException $err) {
                http_response_code(401);
                echo json_encode($err);
                exit;
            } finally {
                $conn->close();
            }
            break;
    }
}

`
});
