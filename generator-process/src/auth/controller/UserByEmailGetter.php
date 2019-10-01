<?php

namespace RootNamespace\Generated\Auth;

interface UserByEmailGetter
{
    public function getUser(string $email): User;
}