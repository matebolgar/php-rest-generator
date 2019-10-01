<?php

namespace RootNamespace\Generated\Repository\Auth;

use RootNamespace\Generated\Auth\RawToken;
use RootNamespace\Generated\Auth\RefreshToken;
use RootNamespace\Generated\Auth\RefreshTokenSaver;

class MysqlRefreshTokenSaver implements RefreshTokenSaver
{
    private $connection;

    public function __construct(\mysqli $connection)
    {
        $this->connection = $connection;
    }

    public function save(RawToken $token): RefreshToken
    {
        $stmt = $this->connection->prepare('INSERT INTO `tokens` (`id`, `userId`, `value`) VALUES (NULL, ?, ?)');

        call_user_func(function ($userId, $token) use ($stmt) {
            $stmt->bind_param('ss', $userId, $token);
        }, $token->getUserId(), $token->getRefreshToken()->getValue());

        $stmt->execute();

        return $token->getRefreshToken();
    }
}
