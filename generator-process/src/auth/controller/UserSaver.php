<?php

namespace RootNamespace\Generated\Auth;

interface UserSaver
{
    public function save(NewUser $user): User;
}