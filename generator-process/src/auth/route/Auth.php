<?php

namespace RootNamespace\Generated\Route\Auth;

use Exception;
use FastRoute\RouteCollector;
use mysqli;
use RootNamespace\Generated\Request;
use RootNamespace\Generated\Auth\AuthException;
use RootNamespace\Generated\Auth\LoginController;
use RootNamespace\Generated\Auth\LogoutController;
use RootNamespace\Generated\Auth\RefreshController;
use RootNamespace\Generated\Auth\RegistrationController;
use RootNamespace\Generated\Auth\UserListController;
use RootNamespace\Generated\Repository\Auth\JwtTokenGetter;
use RootNamespace\Generated\Repository\Auth\JwtTokenVerifier;
use RootNamespace\Generated\Repository\Auth\MysqlRawTokenGetter;
use RootNamespace\Generated\Repository\Auth\MysqlRefreshTokenSaver;
use RootNamespace\Generated\Repository\Auth\MysqlTokenDeleter;
use RootNamespace\Generated\Repository\Auth\MySqlUserByEmailGetter;
use RootNamespace\Generated\Repository\Auth\MysqlUserLister;
use RootNamespace\Generated\Repository\Auth\MysqlUserSaver;

class Auth
{
    public static function getRoutes(RouteCollector $r, mysqli $conn)
    {
        $r->post('/api/register', self::register($conn));
        $r->post('/api/login', self::login($conn));
        $r->get('/api/users', self::listUsers($conn));
        $r->post('/api/refresh', self::refresh($conn));
        $r->post('/api/logout', self::logout($conn));
    }

    private static function login(mysqli $conn)
    {
        return function (Request $request) use ($conn) {
            $res = (new LoginController(
                new JwtTokenGetter(),
                new MySqlUserByEmailGetter($conn),
                new MysqlRefreshTokenSaver($conn)
            ))->authenticate($request->body);

            return json_encode($res);
        };
    }

    private static function register(mysqli $conn)
    {
        return function (Request $request) use ($conn) {
            if($request->body['pw'] !== $_SERVER['MASTER_PW']) {
                return;
            }
            $res = (new RegistrationController(
                new MysqlUserSaver($conn),
                new MySqlUserByEmailGetter($conn),
                new JwtTokenGetter(),
                new MysqlRefreshTokenSaver($conn)
            ))->register($request->body);

            return json_encode($res);

        };
    }

    private static function listUsers(mysqli $conn)
    {
        return function (Request $request) use ($conn) {
            if(!$request->body['pw'] !== $_SERVER['MASTER_PW']) {
                return;
            }
            try {
                $headers = getallheaders();

                if (!preg_match('/Bearer\s(\S+)/', $headers['Authorization'] ?? '', $matches)) {
                    throw new AuthException('missing token');
                }

                $ctrl = new UserListController(new MysqlUserLister($conn), new JwtTokenVerifier());
                $res = $ctrl->listUsers($matches[1]);
                return json_encode($res);
            } catch (Exception $err) {
                return json_encode($err);
            }
        };
    }

    private static function refresh(mysqli $conn)
    {
        return function (Request $request) use ($conn) {
            return json_encode((new RefreshController(
                new JwtTokenVerifier(),
                new MysqlRawTokenGetter($conn),
                new JwtTokenGetter()
            ))->refresh($request->body['refreshToken'] ?? ''));
        };
    }

    private static function logout(mysqli $conn)
    {
        return function (Request $request) use ($conn) {
            return json_encode((new LogoutController(
                new MysqlTokenDeleter($conn)
            ))->logout($request->body['refreshToken'] ?? ''));
        };
    }
}
