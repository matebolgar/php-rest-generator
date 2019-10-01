<?php

namespace RootNamespace\Generated\Repository\Auth;


use mysqli;
use RootNamespace\Generated\Auth\NewUser;
use RootNamespace\Generated\Auth\User;
use RootNamespace\Generated\Auth\UserSaver;

class MysqlUserSaver implements UserSaver
{
    private $connection;

    public function __construct(mysqli $connection)
    {
        $this->connection = $connection;
    }

    public function save(NewUser $user): User
    {
        $stmt = $this->connection->prepare('INSERT INTO `users` (`id`, `email`, `password`) VALUES (NULL, ?, ?)');

        call_user_func(function ($email, $password) use ($stmt) {
            $stmt->bind_param('ss', $email, $password);
        }, $user->getEmail(), $user->getPassword());

        $stmt->execute();

        return new User((string)$stmt->insert_id, $user->getEmail(), $user->getPassword());
    }
}
