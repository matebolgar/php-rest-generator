<?php

namespace RootNamespace\Generated\Repository\Auth;

use mysqli;
use RootNamespace\Generated\Auth\AuthException;
use RootNamespace\Generated\Auth\RawToken;
use RootNamespace\Generated\Auth\RefreshToken;
use RootNamespace\Generated\Auth\TokenDeleter;

class MysqlTokenDeleter implements TokenDeleter
{
    private $connection;

    public function __construct(mysqli $connection)
    {
        $this->connection = $connection;
    }

    public function delete(RefreshToken $refreshToken): ?RawToken
    {
        $token = (new MysqlRawTokenGetter($this->connection))->getRawToken($refreshToken->getValue());

        if (!$token) {
            throw new AuthException();
        }

        $stmt = $this->connection->prepare('DELETE FROM `tokens` WHERE `tokens`.`userId` = ?');

        call_user_func(function ($token) use ($stmt) {
            $stmt->bind_param('s', $token);
        }, $token->getUserId());

        $stmt->execute();

        if (!$stmt->affected_rows) {
            return null;
        }
        return $token;
    }
}
