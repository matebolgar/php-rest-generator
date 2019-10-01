<?php

namespace RootNamespace\Generated\Auth;

interface RefreshTokenSaver
{
    public function save(RawToken $token): RefreshToken;
}