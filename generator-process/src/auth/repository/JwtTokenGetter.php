<?php

namespace RootNamespace\Generated\Repository\Auth;

use Firebase\JWT\JWT;
use RootNamespace\Generated\Auth\AccessToken;
use RootNamespace\Generated\Auth\RefreshToken;
use RootNamespace\Generated\Auth\TokenGetter;

class JwtTokenGetter implements TokenGetter
{
    public function getAccessToken(string $userId): AccessToken
    {
        return new AccessToken(JWT::encode([
            "sub" => $userId,
            "iat" => time(),
            "exp" => time() + 60 * 60 * 24,
        ], $_SERVER['ACCESS_TOKEN_SECRET']));
    }

    public function getRefreshToken(): RefreshToken
    {
        return new RefreshToken(JWT::encode([
            "iat" => time(),
            "exp" => time() + 60 * 60 * 24 * 30,
        ], $_SERVER['REFRESH_TOKEN_SECRET']));
    }
}