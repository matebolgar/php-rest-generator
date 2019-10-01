<?php

namespace RootNamespace\Generated\Auth;

class RefreshController
{
    private $tokenVerifier;
    private $rawTokenGetter;
    private $tokenGetter;

    public function __construct(TokenVerifier $tokenVerifier, RawTokenGetter $rawTokenGetter, TokenGetter $tokenGetter)
    {
        $this->tokenVerifier = $tokenVerifier;
        $this->rawTokenGetter = $rawTokenGetter;
        $this->tokenGetter = $tokenGetter;
    }

    public function refresh(string $tokenValue): AccessToken
    {
        $token = $refreshToken = $this->rawTokenGetter->getRawToken($tokenValue);

        if (!$token) {
            throw new AuthException();
        }

        return $this->tokenGetter->getAccessToken($token->getUserId());
    }
}
